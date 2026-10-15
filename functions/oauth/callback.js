// OAuth 回调：用 code 换 token，通过 postMessage 回传给 Decap CMS
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return new Response(`OAuth error: ${error}`, { status: 400 });
  }

  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }

  // 用 code 换取 access_token
  const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'decap-cms-oauth-proxy',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: code,
    }),
  });

  const tokenData = await tokenResp.json();
  const token = tokenData.access_token;

  if (!token) {
    return new Response(`Failed to get token: ${JSON.stringify(tokenData)}`, { status: 500 });
  }

  // 返回 HTML，通过 postMessage 把 token 发给 Decap CMS 窗口
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Authorizing...</title></head>
<body>
<p>Authorization successful. You can close this window.</p>
<script>
  (function() {
    var msg = {
      type: 'authorization',
      payload: {
        token: '${token}',
        provider: 'github'
      }
    };
    if (window.opener) {
      window.opener.postMessage(msg, '*');
    }
    window.close();
  })();
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

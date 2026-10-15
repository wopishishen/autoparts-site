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

  // 返回 HTML，通过 Decap CMS 两步握手协议回传 token
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Authorizing...</title></head>
<body>
<p>Authorization successful. Closing...</p>
<script>
  (function() {
    var token = '${token}';
    var targetOrigin = 'https://autoparts-site.pages.dev';
    var handshakeDone = false;

    function sendSuccess() {
      if (window.opener && !window.opener.closed) {
        var payload = JSON.stringify({ token: token, provider: 'github' });
        window.opener.postMessage('authorization:github:success:' + payload, targetOrigin);
      }
      setTimeout(function() { window.close(); }, 500);
    }

    // 第二步：收到主窗口握手确认后，发送 token
    window.addEventListener('message', function(e) {
      if (e.data === 'authorizing:github' && !handshakeDone) {
        handshakeDone = true;
        sendSuccess();
      }
    });

    // 第一步：发送握手消息
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage('authorizing:github', targetOrigin);
    }

    // 容错：2 秒内没收到握手确认也直接发 token（兼容宽松实现）
    setTimeout(function() {
      if (!handshakeDone) {
        handshakeDone = true;
        sendSuccess();
      }
    }, 2000);
  })();
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

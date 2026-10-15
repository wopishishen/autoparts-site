import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

// 读取所有商品 slug，用于遍历测试详情页
const productsDir = join(process.cwd(), 'content', 'products');
const productSlugs = readdirSync(productsDir)
  .filter(f => f.endsWith('.json'))
  .map(f => f.replace('.json', ''));

test.describe('冒烟测试 - 核心页面可访问性', () => {

  test('首页可访问且包含关键区域', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // 检查关键区域存在
    await expect(page.locator('body')).toContainText(/产品|Product|分类|Category/i);
  });

  test('商品列表页可访问且显示商品', async ({ page }) => {
    const response = await page.goto('/products');
    expect(response?.status()).toBe(200);

    // 至少有一个商品卡片或商品链接
    const productLinks = page.locator('a[href*="/products/"]');
    await expect(productLinks.first()).toBeVisible();
  });

  test('联系页可访问且包含表单', async ({ page }) => {
    const response = await page.goto('/contact');
    expect(response?.status()).toBe(200);

    // 表单存在
    const form = page.locator('form');
    await expect(form.first()).toBeVisible();
  });

  test('CMS 管理后台可访问', async ({ page }) => {
    const response = await page.goto('/admin/');
    expect(response?.status()).toBe(200);
  });

});

test.describe('冒烟测试 - 商品详情页遍历', () => {

  for (const slug of productSlugs) {
    test(`商品详情页: ${slug}`, async ({ page }) => {
      const response = await page.goto(`/products/${slug}`);
      expect(response?.status(), `详情页 /products/${slug} 应返回 200`).toBe(200);

      // 页面不应包含错误信息
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toContain('500');
      expect(bodyText).not.toContain('Internal Server Error');
    });
  }

});

test.describe('冒烟测试 - 静态资源', () => {

  test('分类图片可访问', async ({ page }) => {
    const categoriesDir = join(process.cwd(), 'content', 'categories');
    const categoryFiles = readdirSync(categoriesDir).filter(f => f.endsWith('.json'));

    for (const file of categoryFiles) {
      const content = JSON.parse(readFileSync(join(categoriesDir, file), 'utf-8'));
      if (content.image) {
        const imgPath = content.image.startsWith('/') ? content.image : '/' + content.image;
        const response = await page.goto(imgPath);
        expect(response?.status(), `分类图片 ${imgPath} 应返回 200`).toBe(200);
      }
    }
  });

});

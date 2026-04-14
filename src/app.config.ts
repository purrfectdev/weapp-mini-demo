export default defineAppConfig({
  pages: [
    "pages/index/index",
    // "pages/todo/index",
    // "pages/qrcode/index",
    // "pages/signature/index",
  ],
  subPackages: [
    {
      root: "subpackages/todo",
      name: "todo",
      pages: [
        "pages/index/index", // 待办清单
      ],
    },
    {
      root: "subpackages/qrcode",
      name: "qrcode",
      pages: [
        "pages/index/index", // 二维码生成
      ],
    },
    {
      root: "subpackages/signature",
      name: "signature",
      pages: [
        "pages/index/index", // 手写签名
      ],
    },
  ],
  preloadRule: {
    "pages/index/index": {
      network: "all",
      packages: ["todo", "qrcode", "signature"], // 预加载所有子包
    },
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "工具箱",
    navigationBarTextStyle: "black",
  },
});

export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/todo/index",
    "pages/qrcode/index",
  ],
  // subPackages: [
  //   {
  //     root: "packageTodo",
  //     pages: [
  //       "todo/index", // 待办清单
  //     ],
  //   },
  //   {
  //     root: "packageQrcode",
  //     pages: [
  //       "qrcode/index", // 二维码生成
  //     ],
  //   },
  //   {
  //     root: "packageSignature",
  //     pages: [
  //       "signature/index", // 手写签名
  //     ],
  //   },
  // ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "工具箱",
    navigationBarTextStyle: "black",
  },
});

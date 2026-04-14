import { View, Text } from "@tarojs/components";
import { Button, Cell } from "@taroify/core";
import { Star, Like, Shop, Arrow, Qr, Edit } from "@taroify/icons";
import Taro from "@tarojs/taro";

// 引入样式
import "@taroify/core/button/style";
import "@taroify/core/cell/style";
import "./index.scss";

export default function Index() {
  return (
    <View className="index">
      {/* 头部 */}
      <View className="header">
        <Text className="title">工具箱</Text>
        <Text className="subtitle">实用小工具集合</Text>
      </View>

      {/* 功能列表 */}
      <View className="card">
        <View className="card-header">
          <Star />
          <Text className="card-title">功能列表</Text>
        </View>
        {/* <Cell
          title="图片压缩"
          brief="压缩图片，减小体积"
          clickable
          isLink
          icon={<Like />}
        /> */}
        <Cell
          title="待办清单"
          brief="记录每日待办事项"
          clickable
          isLink
           icon={<Shop />}
          onClick={() => Taro.navigateTo({ url: "/pages/todo/index" })}
        />
        <Cell
          title="二维码生成"
          brief="文本/网址生成二维码"
          clickable
          isLink
          icon={<Qr />}
          onClick={() => Taro.navigateTo({ url: "/pages/qrcode/index" })}
        />
        <Cell
          title="手写签名(开发中...)"
          brief="手写汉字签名，保存为图片"
          clickable
          isLink
          icon={<Edit />}
          onClick={() => Taro.navigateTo({ url: '/pages/signature/index' })}
        />
      </View>

      {/* 按钮区域 */}
      <View className="button-group">
        <Button block color="primary">
          主要操作
        </Button>
        <Button block>次要操作</Button>
      </View>

      {/* 底部 */}
      <View className="footer">
        <Text className="footer-text">© 2025 我的小程序</Text>
      </View>
    </View>
  );
}

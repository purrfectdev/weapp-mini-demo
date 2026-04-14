import { View, Text, Input, Canvas } from '@tarojs/components'
import { Button } from '@taroify/core'
import { useState, useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import drawQrcode from 'weapp-qrcode-canvas-2d'

import '@taroify/core/button/style'
import './index.scss'

export default function QRCodePage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    // 页面加载时，获取 canvas 实例
    const query = Taro.createSelectorQuery()
    query.select('#qrcode-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res && res[0]) {
          canvasRef.current = res[0]
        }
      })
  }, [])

  const generateQRCode = () => {
    if (!text.trim()) {
      Taro.showToast({ title: '请输入内容', icon: 'none' })
      return
    }

    setLoading(true)

    // 获取 canvas 节点
    const query = Taro.createSelectorQuery()
    query.select('#qrcode-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0]) {
          Taro.showToast({ title: 'Canvas 初始化失败', icon: 'error' })
          setLoading(false)
          return
        }

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        // 设置 canvas 尺寸
        const size = 240
        canvas.width = size
        canvas.height = size

        // 生成二维码
        drawQrcode({
          canvas,
          ctx,
          text: text,
          width: size,
          height: size,
          background: '#ffffff',
          foreground: '#000000',
        })

        setLoading(false)
        Taro.showToast({ title: '生成成功', icon: 'success' })
      })
  }

  const saveToAlbum = () => {
    // 获取 canvas 并保存
    const query = Taro.createSelectorQuery()
    query.select('#qrcode-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0]) return

        const canvas = res[0].node
        Taro.canvasToTempFilePath({
          canvas: canvas,
          success: (res) => {
            Taro.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                Taro.showToast({ title: '保存成功', icon: 'success' })
              },
              fail: () => {
                Taro.showToast({ title: '保存失败', icon: 'error' })
              }
            })
          },
          fail: () => {
            Taro.showToast({ title: '生成图片失败', icon: 'error' })
          }
        })
      })
  }

  return (
    <View className="qrcode-page">
      <View className="header">
        <Text className="title">二维码生成器</Text>
        <Text className="subtitle">文本 / 网址 一键生成二维码</Text>
      </View>

      <View className="input-area">
        <Input
          className="input"
          placeholder="输入文字或网址，如 https://..."
          value={text}
          onInput={(e) => setText(e.detail.value)}
        />
        <Button
          color="primary"
          onClick={generateQRCode}
          loading={loading}
          disabled={!text.trim()}
        >
          生成
        </Button>
      </View>

      {/* Canvas 用于绘制二维码 */}
      <View className="canvas-wrapper">
        <Canvas
          id="qrcode-canvas"
          type="2d"
          className="qrcode-canvas"
          style={{ width: '240px', height: '240px' }}
        />
      </View>

      {text && (
        <View className="button-group">
          <Button onClick={saveToAlbum}>保存到相册</Button>
          <Button
            color="primary"
            onClick={() => {
              Taro.setClipboardData({ data: text })
              Taro.showToast({ title: '已复制', icon: 'success' })
            }}
          >
            复制文本
          </Button>
        </View>
      )}
    </View>
  )
}
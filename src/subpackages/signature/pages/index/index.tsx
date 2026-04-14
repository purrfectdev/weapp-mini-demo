import { View, Text, Canvas } from '@tarojs/components'
import { Button } from '@taroify/core'
import { useState, useRef, useEffect } from 'react'
import Taro from '@tarojs/taro'

import '@taroify/core/button/style'
import './index.scss'

export default function SignaturePage() {
  const canvasRef = useRef<any>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  // 初始化 canvas - 使用更可靠的方式
  useEffect(() => {
    const initCanvas = async () => {
      try {
        // 方法1：使用 createCanvasContext（兼容性更好）
        const ctx = Taro.createCanvasContext('signature-canvas')
        
        if (ctx) {
          // 设置画笔样式
          ctx.setStrokeStyle('#000000')
          ctx.setLineWidth(2)
          ctx.setLineCap('round')
          ctx.setLineJoin('round')
          
          // 白色背景
          ctx.setFillStyle('#ffffff')
          ctx.fillRect(0, 0, 300, 200)
          ctx.draw()
          
          canvasRef.current = ctx
          console.log('Canvas 初始化成功（方式1）')
          return
        }
      } catch (err) {
        console.log('方式1失败，尝试方式2', err)
      }
      
      // 方法2：使用 Canvas 2D API（延迟重试）
      let retryCount = 0
      const tryInit = () => {
        const query = Taro.createSelectorQuery()
        query.select('#signature-canvas2d')
          .fields({ node: true, size: true })
          .exec((res) => {
            if (res && res[0] && res[0].node) {
              const canvas = res[0].node
              const ctx = canvas.getContext('2d')
              const dpr = Taro.getSystemInfoSync().pixelRatio || 2
              
              canvas.width = 300 * dpr
              canvas.height = 200 * dpr
              canvas.style.width = '300px'
              canvas.style.height = '200px'
              
              ctx.scale(dpr, dpr)
              ctx.strokeStyle = '#000000'
              ctx.lineWidth = 2
              ctx.lineCap = 'round'
              ctx.lineJoin = 'round'
              ctx.fillStyle = '#ffffff'
              ctx.fillRect(0, 0, 300, 200)
              
              canvasRef.current = { ctx, canvas, is2d: true }
              console.log('Canvas 初始化成功（方式2）')
            } else if (retryCount < 3) {
              retryCount++
              setTimeout(tryInit, 500)
            } else {
              console.error('Canvas 初始化失败')
              Taro.showToast({ title: 'Canvas 初始化失败', icon: 'error' })
            }
          })
      }
      
      setTimeout(tryInit, 200)
    }
    
    initCanvas()
  }, [])

  // 触摸开始（使用旧版 API）
  const handleTouchStart = (e: any) => {
    if (!canvasRef.current) {
      Taro.showToast({ title: '请稍后，画板初始化中...', icon: 'none' })
      return
    }
    
    const touch = e.touches[0]
    const x = touch.clientX - e.currentTarget.offsetLeft
    const y = touch.clientY - e.currentTarget.offsetTop
    
    // 使用旧版 API
    if (!canvasRef.current.is2d) {
      canvasRef.current.beginPath()
      canvasRef.current.moveTo(x, y)
      setIsDrawing(true)
      setHasSignature(true)
    } else {
      // 使用新版 API
      const ctx = canvasRef.current.ctx
      ctx.beginPath()
      ctx.moveTo(x, y)
      setIsDrawing(true)
      setHasSignature(true)
    }
  }

  // 触摸移动
  const handleTouchMove = (e: any) => {
    if (!isDrawing || !canvasRef.current) return
    e.preventDefault()
    
    const touch = e.touches[0]
    const x = touch.clientX - e.currentTarget.offsetLeft
    const y = touch.clientY - e.currentTarget.offsetTop
    
    if (!canvasRef.current.is2d) {
      canvasRef.current.lineTo(x, y)
      canvasRef.current.stroke()
      canvasRef.current.draw(true)
      canvasRef.current.beginPath()
      canvasRef.current.moveTo(x, y)
    } else {
      const ctx = canvasRef.current.ctx
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  // 触摸结束
  const handleTouchEnd = () => {
    setIsDrawing(false)
  }

  // 清空画布
  const clearCanvas = () => {
    if (!canvasRef.current) return
    
    if (!canvasRef.current.is2d) {
      canvasRef.current.clearRect(0, 0, 300, 200)
      canvasRef.current.setFillStyle('#ffffff')
      canvasRef.current.fillRect(0, 0, 300, 200)
      canvasRef.current.draw()
    } else {
      const ctx = canvasRef.current.ctx
      ctx.clearRect(0, 0, 300, 200)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 300, 200)
    }
    setHasSignature(false)
  }

  // 保存签名
  const saveSignature = () => {
    if (!hasSignature) {
      Taro.showToast({ title: '请先签名', icon: 'none' })
      return
    }
    
    Taro.canvasToTempFilePath({
      canvasId: 'signature-canvas',
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
      fail: (err) => {
        console.error('生成图片失败:', err)
        Taro.showToast({ title: '生成图片失败', icon: 'error' })
      }
    })
  }

  return (
    <View className="signature-page">
      <View className="header">
        <Text className="title">手写签名板</Text>
        <Text className="subtitle">请在下方区域手写签名</Text>
      </View>

      <View className="canvas-area">
        {/* 使用 Canvas 旧版 API（更稳定） */}
        <Canvas
          id="signature-canvas"
          canvasId="signature-canvas"
          className="signature-canvas"
          style={{ width: '300px', height: '200px', border: '1px solid #ddd', background: '#fff' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          disableScroll
        />
        <Text className="hint">手指/手写笔在框内书写</Text>
      </View>

      <View className="button-group">
        <Button color="default" onClick={clearCanvas}>
          清空重写
        </Button>
        <Button color="primary" onClick={saveSignature}>
          保存签名
        </Button>
      </View>

      <View className="tips">
        <Text className="tips-title">温馨提示：</Text>
        <Text className="tips-text">1. 请在白色区域内手写签名</Text>
        <Text className="tips-text">2. 签名将保存为图片到相册</Text>
        <Text className="tips-text">3. 可多次书写后保存</Text>
      </View>
    </View>
  )
}
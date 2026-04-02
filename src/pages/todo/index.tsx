import { View, Text, Input } from '@tarojs/components'
import { Button, Checkbox } from '@taroify/core'
import { useState } from 'react'
import '@taroify/core/button/style'
import '@taroify/core/checkbox/style'
import './index.scss'

export default function Todo() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 Taro', done: false },
    { id: 2, text: '做一个待办清单', done: false },
  ])
  const [inputValue, setInputValue] = useState('')

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputValue, done: false }])
      setInputValue('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  return (
    <View className="todo-page">
      <View className="header">
        <Text className="title">待办清单</Text>
      </View>

      <View className="input-area">
        <Input
          className="input"
          placeholder="添加新任务..."
          value={inputValue}
          onInput={(e) => setInputValue(e.detail.value)}
        />
        <Button size="small" color="primary" onClick={addTodo}>
          添加
        </Button>
      </View>

      <View className="todo-list">
        {todos.map(todo => (
          <View key={todo.id} className="todo-item">
            <Checkbox checked={todo.done} onChange={() => toggleTodo(todo.id)} />
            <Text className={todo.done ? 'done' : ''}>{todo.text}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
<template>
    <div>
        <HelloWorld/>
        <hr/>
        <el-input v-model="message" placeholder="请输入内容"></el-input>
        <div>{{message}}</div>
        <div>tab项懒加载</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="baseinfo">
                <BaseInfo/>
            </el-tab-pane>
            <el-tab-pane label="配置管理" name="feature">
                <keep-alive>
                    <component :is="tabfeature"></component>
                </keep-alive>
            </el-tab-pane>
            <el-tab-pane label="角色管理" name="label">
                <keep-alive>
                    <component :is="tablabel"></component>
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { BaseInfo } from './components'
import HelloWorld from '@/components/HelloWorld.vue'
import $ from 'jquery'
const Feature = resolve => require(['./components/Feature.vue'], resolve)
const Label = resolve => require(['./components/Label.vue'], resolve)
export default {
  name: 'Index',
  components: { BaseInfo, HelloWorld },
  data () {
    return {
      activeName: 'baseinfo',
      message: '',
      tabfeature: null,
      tablabel: null,
      productid: $('#productId').val()
    }
  },
  methods: {
    handleClick (tab, event) {
      var that = this
      switch (tab.name) {
        case 'feature':
          that.tabfeature = Feature
          break
        case 'label':
          that.tablabel = Label
          break
      }
    }
  }
}
</script>
<style>
</style>

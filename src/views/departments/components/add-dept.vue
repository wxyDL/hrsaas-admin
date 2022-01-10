<template>
  <div class="add-dept">
    <el-dialog
      title="提示"
      :visible="showDialog"
      @close="cancel"
    >
      <span>
        <el-form ref="addDeptsRef" label-width="120px" :model="formData" :rules="rules">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="formData.name" placeholder="1-50个字符" />
          </el-form-item>
          <el-form-item label="部门编码" prop="code">
            <el-input v-model="formData.code" placeholder="1-50个字符" />
          </el-form-item>
          <el-form-item label="负责人" prop="manager">
            <el-select v-model="formData.manager" placeholder="请选择" @focus="getEmployeeSimple">
              <el-option v-for="item in userList" :key="item.id" :label="item.username" :value="item.username" />
            </el-select>
          </el-form-item>
          <el-form-item label="部门描述" prop="introduce">
            <el-input v-model="formData.introduce" type="textarea" :rows="3" placeholder="1-300个字符" />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入组织架构接口
import { getDepartments, addDepartments, getDepartDetail, updateDeptDetail } from '@/api/departments'
// 引入员工数据的接口
import { getEmployeeSimple } from '@/api/employees'

export default {

  name: '',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作节点的数据
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const validateName = async(rule, value, callback) => {
      // 实时获取最新的组织架构的数据
      const { depts } = await getDepartments()
      let isRepeat = false
      // 编辑模式的校验规则
      if (this.formData.id) {
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.treeNode.pid).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    const validateCode = async(rule, value, callback) => {
      // 实时获取最新的组织架构的数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`组织架构中已经有部门用了${value}了`)) : callback()
    }
    return {
      // 表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      //   表单校验
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '部门名称不能为空' },
          { trigger: 'blur', min: 1, max: 30, message: '名称1-30个字符之间' },
          { validator: validateName, trigger: 'blur' }
        ],
        code: [
          { required: true, trigger: 'blur', message: '部门编码不能为空' },
          { trigger: 'blur', min: 1, max: 30, message: '编码1-30个字符之间' },
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, trigger: 'blur', message: '负责人不能为空' }
        ],
        introduce: [
          { required: true, trigger: 'blur', message: '部门编码不能为空' },
          { trigger: 'blur', min: 1, max: 300, message: '介绍1-300个字符之间' }
        ]
      },
      //   员工的简单数据
      userList: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //   获取员工的简单数据
    async getEmployeeSimple() {
      // 调用员工数据接口
      this.userList = await getEmployeeSimple()
    },
    // 点击确定添加部门
    btnOk() {
      this.$refs.addDeptsRef.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            await updateDeptDetail(this.formData)
          } else {
            //   调用添加部门的接口
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
            this.$message.success('新增部门成功')
          }
          // 提交父组件更新组织架构
          this.$emit('addDepts')
          this.$emit('update:showDialog', false)
        } else {
          this.$message.error('请填写必要的信息')
          return false
        }
      })
    },
    // 取消对话框
    cancel() {
      // 重置校验字段
      this.$refs.addDeptsRef.resetFields()
      //   关闭对话框
      this.$emit('update:showDialog', false)
    },
    // 获取部门详情的方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style scoped lang = "less">

</style>

<template>
  <div class="app-container">
    <div style="border:1px solid #d8dce5">
      <el-form ref="form" :model="form" style="border-radius:2px solid #000">
        <el-row>
          <el-col :span="8">
            <el-form-item label="法定代表人:">
              {{ form.legal.length > 25 ? form.legal.substring(0, 24) + '...': form.legal }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经营状态:">
              {{ form.status=='0' ? '禁用': '启用' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成立日期:">
              {{ form.buildDate }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="注册资本:">
              {{ form.registeredCapital }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实缴资本:">
              {{ form.paidCapital }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核准日期:">
              {{ form.auditDate }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="统一社会信用代码:">
              {{ form.uscc }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="组织机构代码:">
              {{ form.orgCode }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工商注册号:">
              {{ form.baRegisterCode }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="纳税人识别号:">
              {{ form.taxpayerCode }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="进出口企业代码:">
              {{ form.impExpCode }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属行业:">
              {{ form.trade }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业类型:">
              {{ form.type }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="营业期限:">
              {{ form.endDate }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记机关:">
              {{ form.regOffice }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="人员规模:">
              {{ form.staffSize }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="参保人数:">
              {{ form.inseredSize }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属地区:">
              {{ form.belongRegion }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业名称:">
              {{ form.name }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名:">
              {{ form.nameEn }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="企业地址:">
              {{ form.addr }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="经营范围:">
              {{ form.businessScope }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    params: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.form = this.params
    }
  }
}
</script>
<style scoped lang="scss">
/deep/.el-drawer__close-btn{
  color: red
}
.el-form-item{
  margin-top: 5px;
  margin-left: 15px;
  margin-right: 15px;
}
</style>

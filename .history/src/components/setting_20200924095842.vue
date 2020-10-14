<template>
  <div>
    <el-button @click="switchTable">切换表格</el-button>
    <div v-if="switchTableFlag">
      <el-button @click="exportExcel">导出</el-button>
      <upload-excel @excelData="excelUpdateData"></upload-excel>
    </div>
    <div v-if="!switchTableFlag">
      <el-button @click="showAddDailog">添加</el-button>
    </div>
    <el-table v-if="!switchTableFlag" :data="allDevInfor">
      <el-table-column label="设备ID" prop="devID"></el-table-column>
      <el-table-column label="播放类型" prop="displayType"></el-table-column>
      <el-table-column label="所属设备" prop="devName"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <div>
            <el-button @click="checkDialog(scope.row)">查看</el-button>
            <el-button @click="updateDevice(scope.row)">修改</el-button>
            <el-button @click="deleteDevice(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-table id="channelTable" v-if="switchTableFlag" :data="allChannels">
      <el-table-column label="设备ID" prop="devID"></el-table-column>
      <el-table-column label="播放类型" prop="displayType"></el-table-column>
      <el-table-column label="所属设备" prop="devName"></el-table-column>
      <el-table-column label="所属区域" prop="channelName">1111</el-table-column>
      <el-table-column label="所在位置" prop="areas"></el-table-column>
      <el-table-column label="是否关联摄像头" prop="cameraExist"></el-table-column>
      <el-table-column label="操作">
        <template>
          <div>
            <el-button>修改位置</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogCheckVisible">
      <el-form :model="checkForm" label-width="120px" label-position="left" :inline="true">
        <el-form-item label="设备id" prop="devID">
          <el-input v-model="checkForm.devID" disabled width="400px"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="displayType">
          <el-input v-model="checkForm.displayType" disabled width="400px"></el-input>
        </el-form-item>
        <el-form-item label="设备名" prop="devName">
          <el-input v-model="checkForm.devName" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备用户" prop="devAdmin">
          <el-input v-model="checkForm.devAdmin" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备密码" prop="devPassword">
          <el-input v-model="checkForm.devPassword" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备IP" prop="devIP">
          <el-input v-model="checkForm.devIP" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备端口号" prop="devPort">
          <el-input v-model="checkForm.devPort" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备序列号" prop="devSerial">
          <el-input v-model="checkForm.devSerial" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备验证码" prop="validateCode">
          <el-input v-model="checkForm.validateCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="摄像头数量" prop="cameraNum">
          <el-input v-model="checkForm.cameraNum" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogUpdateVisible">
      <el-form :model="updateForm" label-width="120px" label-position="right" :inline="true" :rules="rules">
        <el-form-item label="设备id" prop="devID">
          <el-input v-model="updateForm.devID" width="400px" :disabled="!commonInputFlag"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="displayType">
          <el-select v-model="updateForm.displayType" placeholder="请选择" @change="changeDevInput" disabled>
            <el-option label="H5stream" value="H5stream"></el-option>
            <el-option label="YSCloud" value="YSCloud"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名" prop="devName">
          <el-input v-model="updateForm.devName" :disabled="!commonInputFlag"></el-input>
        </el-form-item>
        <el-form-item label="设备用户" prop="devAdmin">
          <el-input v-model="updateForm.devAdmin" :disabled="updateH5streamFlag"></el-input>
        </el-form-item>
        <el-form-item label="设备密码" prop="devPassword">
          <el-input v-model="updateForm.devPassword" :disabled="updateH5streamFlag"></el-input>
        </el-form-item>
        <el-form-item label="设备IP" prop="devIP">
          <el-input v-model="updateForm.devIP" :disabled="updateH5streamFlag"></el-input>
        </el-form-item>
        <el-form-item label="设备端口号" prop="devPort">
          <el-input v-model="updateForm.devPort" :disabled="updateH5streamFlag"></el-input>
        </el-form-item>
        <el-form-item label="设备序列号" prop="devSerial">
          <el-input v-model="updateForm.devSerial" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备验证码" prop="validateCode">
          <el-input v-model="updateForm.validateCode" disabled></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="dialogUpdateVisible=false">取消</el-button>
        <el-button @click="updateDeviceInfor">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import UploadExcel from "./uploadExcel";
export default {
  data() {
    var devIDRule = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("设备ID不能为空"));
      }
      console.log(value);
      setTimeout(async () => {
        if (value.toString().length < 3 || value.toString().length > 7) {
          callback(new Error('id长度大于3小于7'));
        } else {
          const { data: devIDData } = await this.$http.post(
            "/api/user/select_devID"
          );
          for (const key in devIDData) {
            if (devIDData.hasOwnProperty(key)) {
              const element = devIDData[key];
              if (value === element.devID) {
                callback(new Error("ID已经存在，请重新输入"));
              }
            }
          }
        }
      }, 1000);
    };
    return {
      switchTableFlag: false,
      dialogAddVisible: false,
      addDevInfor: {
        devID: "",
        validateCode: "",
        devSerial: "",
        devPort: "",
        devIP: "",
        password: "",
        admin: "",
        devName: "",
        displayType: "H5stream"
      },
      allDevInfor: [],
      checkForm: [],
      updateForm: {},
      dialogCheckVisible: false,
      checkOrUpdate: false,
      dialogUpdateVisible: false,
      allDevPlayChannels: {},
      // dialogChannelVisible: false,
      dialogUpdateChannelVisible: false,
      accessToken: {},
      targetChannels: [],
      updateToken: "",
      updateDisplayType: "",
      updateDeviceSerial: "",
      // 获取所有通道信息
      allChannels: [],
      // allYSChannels: [],
      targetChannelName: "",
      session: "",
      h5streamFlag: false,
      // twoDisplayType: [{ value: "H5stream" }, { value: "YSCloud" }],
      playType: "H5stream",
      commonInputFlag: true,
      H5streamInputFlag: true,
      YSInputFlag: false,
      channelToken: {},
      updateFlag: false,
      updateDialogFlag: false,
      expandChannels: [],
      expands: [],
      getRowKeys(row) {
        return row.devID;
      },
      expandShow: false,
      updateH5streamFlag: false,
      updateYSFlag: false,
      uploadex: false,
      rules: {
        displayType: [
          {
            required: true,
            message: "请输入播放类型",
            trigger: "blur"
          }
        ],
        devID: [{ validator: devIDRule, trigger: "blur" }],
        devName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
          { max: 15, message: "id长度大于3小于5", trigger: "blur" }
        ],
        admin: [
          { required: true, message: "请输入设备用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入设备密码", trigger: "blur" }
        ],
        devIP: [
          { required: true, message: "请输入设备的IP地址", trigger: "blur" },
          {
            required: true,
            pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确的IP地址",
            trigger: "blur"
          }
        ],
        devPort: [
          { required: true, message: "请输入设备端口号", trigger: "blur" }
        ],
        devSerial: [
          { required: true, message: "请输入设备序列号", trigger: "blur" }
        ],
        validateCode: [
          { required: true, message: "请输入设备验证码", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    UploadExcel
  },
  mounted() {
    this.getAllDevInfor();
    this.getAccessToken();
    this.bindRealplayAddress();
  },
  methods: {
    async bindRealplayAddress() {
      const source = [];
      for (let index = 0; index < 32; index++) {
        const data = await this.$http.post('https://open.ys7.com/api/lapp/live/video/open?accessToken=at.66pe842a0ldo3kws9as99lzr89omxcgk-9kej0q3rfe-1lr06zp-ol93j68d2&source=E47052985:' + (index + 1));
        source.push(data);
      }
      console.log(source);
    },
    // showScope(data) {
    //   console.log(4444, data);
    // },
    async getAccessToken() {
      const { data: accessToken } = await this.$http.post(
        'https://open.ys7.com/api/lapp/token/get?appKey=ac8dedeb2f344715bfb005be1fb7c01f&appSecret=47f58842cd2d0617d5ad0a45d1cc9cbc'
      );
      this.accessToken = accessToken.data.accessToken;
      console.log(this.accessToken);
    },
    // 当点击展开的时候,从数据库读取当前设备的所有channels信息
    exChange(row, expandedRows) {
      this.expandShow = false;
      this.expandChannels = [];
      var that = this;
      if (expandedRows.length) {
        that.expands = [];
        if (row) {
          that.expands.push(row.devID);
        }
      } else {
        that.expands = [];
      }
      const { data: expandChannels } = this.$http
        .post("/api/user/select_target_channel", {
          devID: row.devID
        })
        .then(response => {
          this.expandChannels = response.data;
          this.expandShow = true;
        });
    },

    async getH5streamSessin() {
      const { data: session } = await this.$http.get(
        "http://localhost:6060/api/v1/Login?user=admin&password=827ccb0eea8a706c4c34a16891f84e7b"
      );
      this.session = session.strSession;
      console.log(this.session);
    },

    // 获取所有硬盘录像机设备的信息
    async getAllDevInfor() {
      this.allDevInfor = (await this.$http.post("/api/user/selectDevInfor")).data;
    },

    // 更新所有nvr设备的多少通道连接了摄像头
    async nvrChannelsCamerasNum() {
      console.log(2222, this.allDevInfor);
      for (let index = 0; index < this.allDevInfor.length; index++) {
        const element = this.allDevInfor[index];
        if (element.displayType === "H5stream") {
          const {
            data: { src: camera }
          } = await this.$http.post(
            "http://localhost:6060/api/v1/GetDeviceSrc?token=" +
              element.devID +
              "&getonline=true&session=3db6e64e-eb7f-413d-9fe0-415c79f1b6f1"
          );
          // console.log(camera);
          var cameraNum = 0;
          for (let index = 0; index < camera.length; index++) {
            const el = camera[index];
            console.log(555, el);

            if (el.bOnline) {
              console.log(el.strToken);
              await this.$http.post("/api/user/update_channel_camera", {
                cameraExist: "true",
                devID: el.strToken
              });
              cameraNum += 1;
            } else {
              await this.$http.post("/api/user/update_channel_camera", {
                cameraExist: "false",
                devID: el.strToken
              });
            }
          }
          // console.log(cameraNum);
          await this.$http.post("/api/user/update_camera_num", {
            cameraNum: cameraNum,
            devID: element.devID
          });
        } else {
          var cameraNum = 0;
          const {
            data: { data: channels }
          } = await this.$http.post(
            "https://open.ys7.com/api/lapp/device/camera/list?accessToken=" +
              this.accessToken +
              "&deviceSerial=" +
              element.devSerial
          );
          for (let index = 0; index < channels.length; index++) {
            const el = channels[index];
            if (el.relatedIpc) {
              await this.$http.post("/api/user/update_channel_camera", {
                cameraExist: "true",
                devID: element.devID + "--" + el.channelNo
              });
              cameraNum += 1;
            } else {
              await this.$http.post("/api/user/update_channel_camera", {
                cameraExist: "false",
                devID: element.devID + "--" + el.channelNo
              });
            }
          }
          await this.$http.post("/api/user/update_camera_num", {
            cameraNum: cameraNum,
            devID: element.devID
          });
        }
      }
      this.getAllDevInfor();
    },

    // 展示添加弹窗
    showAddDailog() {
      this.dialogAddVisible = true;
    },
    // 添加设备信息
    addDevice() {
      this.$http
        .post(
          "/api/user/addUser",
          {
            devID: this.addDevInfor.devID,
            validateCode: this.addDevInfor.validateCode,
            devSerial: this.addDevInfor.devSerial,
            devPort: this.addDevInfor.devPort,
            devIP: this.addDevInfor.devIP,
            devPassword: this.addDevInfor.password,
            devAdmin: this.addDevInfor.admin,
            devName: this.addDevInfor.devName,
            displayType: this.addDevInfor.displayType,
            cameraNum: "0"
          },
          {}
        )
        .then(response => {
          // console.log(response);
        });
      if (this.addDevInfor.displayType === "H5stream") {
        this.addH5streamDevice(
          this.addDevInfor.devName,
          this.addDevInfor.devID,
          this.addDevInfor.admin,
          this.addDevInfor.password,
          this.addDevInfor.devIP,
          this.addDevInfor.devPort
        );
      } else if (this.addDevInfor.displayType === "YSCloud") {
        this.addYSdevice(
          this.accessToken,
          this.addDevInfor.devSerial,
          this.addDevInfor.validateCode
        );
      }
      this.getAllDevInfor();
      this.dialogAddVisible = false;
    },
    updateDevice(updateInfo) {
      this.updateToken = updateInfo.devID;
      this.updateDeviceSerial = updateInfo.devSerial;
      this.updateDisplayType = updateInfo.displayType;
      this.dialogUpdateVisible = true;
      this.updateForm = updateInfo;
      if (updateInfo.displayType === "H5stream") {
        this.updateH5streamFlag = false;
        this.updateYSFlag = true;
      } else {
        this.updateH5streamFlag = true;
        this.updateYSFlag = false;        
      }
    },
    deleteDevice(deleteInfo) {
      console.log(deleteInfo.devName);
      this.$http
        .post(
          "/api/user/delete",
          {
            devName: deleteInfo.devName
          },
          {}
        )
        .then(response => {
          // console.log(response);
          this.deleteChannel(deleteInfo.devName);
        });
      if (deleteInfo.displayType === "H5stream") {
        this.deleteH5streamDevice(deleteInfo.devID);
      } else {
        this.deleteYSdevice(this.accessToken, deleteInfo.devSerial);
      }
      this.getAllDevInfor();
    },
    // 更新
    async updateDeviceInfor() {
      this.updateFlag = true;
      await this.$http.post(
        "/api/user/update",
        {
          devID: this.updateForm.devID,
          validateCode: this.updateForm.validateCode,
          devSerial: this.updateForm.devSerial,
          devPort: this.updateForm.devPort,
          devIP: this.updateForm.devIP,
          devPassword: this.updateForm.devPassword,
          devAdmin: this.updateForm.devAdmin,
          devName: this.updateForm.devName,
          displayType: this.updateForm.displayType
        },
        {}
      );
      if (this.updateDisplayType === "H5stream") {
        const token = this.updateToken;
        const { data: channelToken } = await this.$http.get(
          "http://localhost:6060/api/v1/GetDeviceSrc?token=" +
            this.updateForm.devID +
            "&getonline=true&session=3db6e64e-eb7f-413d-9fe0-415c79f1b6f1"
        );
        for (let index = 0; index < channelToken.src.length; index++) {
          const element = channelToken.src[index];
          await this.$http.post("/api/user/update_channelname", {
            devID: element.strToken,
            devName: this.updateForm.devName
          });
        }
        await this.deleteH5streamDevice(this.updateToken);
        await this.addH5streamDevice(
          this.updateForm.devName,
          this.updateForm.devID,
          this.updateForm.devAdmin,
          this.updateForm.devPassword,
          this.updateForm.devIP,
          this.updateForm.devPort
        );
      } else {
        const {
          data: { data: channels }
        } = await this.$http.post(
          "https://open.ys7.com/api/lapp/device/camera/list?accessToken=" +
            this.accessToken +
            "&deviceSerial=" +
            this.updateForm.devSerial
        );
        for (let index = 0; index < channels.length; index++) {
          const ch = channels[index];
          await this.$http.post("/api/user/update_channelname", {
            devID: this.updateForm.devID + "--" + ch.channelNo,
            devName: this.updateForm.devName
          });
        }
      }
      this.dialogUpdateVisible = false;
    },

    checkDialog(checkInfo) {
      this.dialogCheckVisible = true;
      this.checkOrUpdate = true;
      this.checkForm = checkInfo;
      console.log(this.checkForm);
    },

    // 添加h5stream设备
    async addH5streamDevice(
      strName,
      strToken,
      strUser,
      strPasswd,
      strDevIpAddress,
      strDevPort
    ) {     
      await this.$http.get(
        "http://localhost:6060/api/v1/AddDeviceHik?name=" +
          strName +
          "&token=" +
          strToken +
          "&user=" +
          strUser +
          "&password=" +
          strPasswd +
          "&ip=" +
          strDevIpAddress +
          "&port=" +
          strDevPort +
          "&audio=false&session=3db6e64e-eb7f-413d-9fe0-415c79f1b6f1"
      );
      if (this.updateFlag === false) {
        while (1) {
          const { data: channelToken } = await this.$http.get(
            "http://localhost:6060/api/v1/GetDeviceSrc?token=" +
              strToken +
              "&getonline=true&session=3db6e64e-eb7f-413d-9fe0-415c79f1b6f1"
          );
          if (channelToken.src.length !== 0) {
            this.channelToken = channelToken.src;
            this.addAllChannelsToMysql(this.channelToken);
            this.updateFlag = false;
            break;
          }
        }
      }
    },
    // 删除H5stream设备
    async deleteH5streamDevice(strToken) {
      await this.$http.get(
        "http://localhost:6060/api/v1/DelDevice?token=" +
          strToken +
          "&session=3db6e64e-eb7f-413d-9fe0-415c79f1b6f1"
      );
    },
    // 萤石云获取accessToken
    // 萤石云添加设备
    // C58487783
    async addYSdevice(accessToken, devSerial, validateCode) {
      const addinf = await this.$http.post(
        "https://open.ys7.com/api/lapp/device/add?accessToken=" +
          accessToken +
          "&deviceSerial=" +
          devSerial +
          "&validateCode=" +
          validateCode
      );
      const {
        data: { data: channels }
      } = await this.$http.post(
        "https://open.ys7.com/api/lapp/device/camera/list?accessToken=" +
          this.accessToken +
          "&deviceSerial=" +
          devSerial
      );
      var source = "";
      for (let index = 0; index < channels.length; index++) {
        const element = channels[index];
        source = source + element.deviceSerial + ":" + element.channelNo + ",";
      }
      source = source.substring(0, source.length - 1);
      const {
        data: { data: realplayAddress }
      } = await this.$http.post(
        "https://open.ys7.com/api/lapp/live/address/get?accessToken=" +
          this.accessToken +
          "&source=" +
          source
      );
      for (let index = 0; index < channels.length; index++) {
        const ch = channels[index];
        const src = realplayAddress[index];
        await this.$http.post("/api/user/addChannel", {
          devID: this.addDevInfor.devID + "--" + ch.channelNo,
          displayType: this.addDevInfor.displayType,
          devName: this.addDevInfor.devName,
          channelName: "",
          ysRealplayChannel: src.hls,
          devSerial: devSerial
        });
      }
    },
    // 萤石云删除设备
    async deleteYSdevice(accessToken, devSerial) {
      await this.$http.post(
        "https://open.ys7.com/api/lapp/device/delete?accessToken=" +
          accessToken +
          "&deviceSerial=" +
          devSerial
      );
    },

    // 修改通道位置
    updateChannelsName(data) {
      this.dialogUpdateChannelVisible = true;
      this.targetChannels = data;
    },
    
    async updateChannelInfor(channelName, areas, devID) {
      console.log(channelName, devID, areas);
      await this.$http.post(
        "/api/user/update_channel",
        {
          channelName: channelName,
          areas: areas,
          devID: devID
        },
        {}
      );
    },
    exportExcel() {
      /* generate workbook object from table */
      //表名
      var wb = XLSX.utils.table_to_book(
        document.querySelector("#channelTable")
      );
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "order.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    excelUpload() {
      this.uploadex = true;
    },
    excelUpdateData(data) {
      console.log(444, data);
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        console.log(element);
        this.updateChannelInfor(
          element.channelName,
          element.areas,
          element.devID
        );
      }
      this.selectAllChannels();
    },
    async selectAllChannels() {
      this.allChannels = (await this.$http.post('/api/user/selectAllChannels')).data;
      console.log(2222, this.allChannels);
    },
    // 切换表格
    switchTable() {
      this.selectAllChannels();
      this.switchTableFlag = !this.switchTableFlag;
    },
    // 删除某个设备的所有通道
    async deleteChannel(devName) {
      await this.$http.post("/api/user/delete_channel", {
        devName: devName
      });
    },
    changeDevInput(type) {
      // console.log(111111);
      if (type === "H5stream") {
        this.commonInputFlag = true;
        this.H5streamInputFlag = true;
        this.YSInputFlag = false;
      } else if (type === "YSCloud") {
        this.commonInputFlag = true;
        this.H5streamInputFlag = false;
        this.YSInputFlag = true;
      }
    },
    // 当添加设备完成后，添加该设备的所有通道到数据库中
    async addAllChannelsToMysql(channelToken) {
      for (let index = 0; index < channelToken.length; index++) {
        const ch = channelToken[index];
        await this.$http.post("/api/user/addChannel", {
          devID: ch.strToken,
          displayType: this.addDevInfor.displayType,
          devName: this.addDevInfor.devName
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.exportButton {
  display: flex;
  flex-direction: row;
}
.excelUpdateData {
  margin-left: 50px;
}
</style>
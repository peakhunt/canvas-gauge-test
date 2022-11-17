<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6" class="d-flex" style="flex-direction:column">
        <v-card dark rounded class="flex-grow-1" color="#952175" height="320">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline">
                Running Status
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ isSimRunning ? 'Running' : 'Stopped' }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-h6">{{runtimeString}} / {{gaugeValue}} / {{dataCount}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar tile size="80">
              <v-btn icon x-large>
                <v-tooltip bottom v-if="!isSimRunning">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-on="on">
                      <v-icon
                        v-bind="attrs"
                        x-large
                        v-if="!isSimRunning"
                        :disabled="!canStartSimulation"
                        @click.stop="startSimulation">mdi-play-circle-outline</v-icon>
                      </div>
                  </template>
                  <span> Start Simulation</span>
                </v-tooltip>

                <v-tooltip bottom v-if="isSimRunning">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-on="on">
                      <v-icon
                        v-bind="attrs"
                        x-large
                        v-if="isSimRunning"
                        @click.stop="stopSimulation">mdi-stop-circle-outline</v-icon>
                    </div>
                  </template>
                  <span>Stop Simulation</span>
                </v-tooltip>
              </v-btn>
            </v-list-item-avatar>
          </v-list-item>
          <v-card-text>
            <v-form v-model="inputDataValid">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="interval"
                    v-model.number="dataGenerationInterval"
                    type="number"
                    suffix="ms"
                    :rules="[rules.dataInterval]"
                    required
                    :readonly="isSimRunning"
                    hint="data generation interval">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" class="d-flex" style="flex-direction:column">
        <v-card dark rounded class="flex-grow-1 elevation-0" color="transparent" ref="compassCard">
          <v-container fill-height fluid v-resize="onResize">
            <v-row align="center" justify="center">
              <RadialGauge :value="gaugeValue" :options="gaugeOptions" ref="gauge"></RadialGauge>
            </v-row>
          </v-container>
        </v-card>
      </v-col>

      <v-col cols="6" class="d-flex" style="flex-direction:column">
        <v-card dark rounded class="flex-grow-1" color="#952175" height="320">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline">
                Running Status
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ isSimRunningLinear ? 'Running' : 'Stopped' }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-h6">{{runtimeStringLinear}} / {{gaugeValueLinear}} / {{dataCountLinear}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar tile size="80">
              <v-btn icon x-large>
                <v-tooltip bottom v-if="!isSimRunningLinear">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-on="on">
                      <v-icon
                        v-bind="attrs"
                        x-large
                        v-if="!isSimRunningLinear"
                        :disabled="!canStartSimulationLinear"
                        @click.stop="startSimulationLinear">mdi-play-circle-outline</v-icon>
                      </div>
                  </template>
                  <span> Start Simulation</span>
                </v-tooltip>

                <v-tooltip bottom v-if="isSimRunningLinear">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-on="on">
                      <v-icon
                        v-bind="attrs"
                        x-large
                        v-if="isSimRunningLinear"
                        @click.stop="stopSimulationLinear">mdi-stop-circle-outline</v-icon>
                    </div>
                  </template>
                  <span>Stop Simulation</span>
                </v-tooltip>
              </v-btn>
            </v-list-item-avatar>
          </v-list-item>
          <v-card-text>
            <v-form v-model="inputDataValidLinear">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="interval"
                    v-model.number="dataGenerationIntervalLinear"
                    type="number"
                    suffix="ms"
                    :rules="[rules.dataInterval]"
                    required
                    :readonly="isSimRunningLinear"
                    hint="data generation interval">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" class="d-flex" style="flex-direction:column">
        <v-card dark rounded class="flex-grow-1 elevation-0" color="transparent" ref="compassCard">
          <v-container fill-height fluid v-resize="onResize">
            <v-row align="center" justify="center">
              <LinearGauge :value="gaugeValueLinear" :options="gaugeOptionsLinear" ref="linearGauge"></LinearGauge>
            </v-row>
          </v-container>
        </v-card>
      </v-col>

      <v-col cols="6" class="d-flex" style="flex-direction:column">
        <v-card dark rounded class="flex-grow-1" color="#952175" height="320">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline">
                Running Status
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ isSimRunningSVG ? 'Running' : 'Stopped' }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-h6">{{runtimeStringSVG}} / {{gaugeValueSVG}} / {{dataCountSVG}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar tile size="80">
              <v-btn icon x-large>
                <v-tooltip bottom v-if="!isSimRunningSVG">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-on="on">
                      <v-icon
                        v-bind="attrs"
                        x-large
                        v-if="!isSimRunningSVG"
                        :disabled="!canStartSimulationSVG"
                        @click.stop="startSimulationSVG">mdi-play-circle-outline</v-icon>
                      </div>
                  </template>
                  <span> Start Simulation</span>
                </v-tooltip>

                <v-tooltip bottom v-if="isSimRunningSVG">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-on="on">
                      <v-icon
                        v-bind="attrs"
                        x-large
                        v-if="isSimRunningSVG"
                        @click.stop="stopSimulationSVG">mdi-stop-circle-outline</v-icon>
                    </div>
                  </template>
                  <span>Stop Simulation</span>
                </v-tooltip>
              </v-btn>
            </v-list-item-avatar>
          </v-list-item>
          <v-card-text>
            <v-form v-model="inputDataValidSVG">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="interval"
                    v-model.number="dataGenerationIntervalSVG"
                    type="number"
                    suffix="ms"
                    :rules="[rules.dataInterval]"
                    required
                    :readonly="isSimRunningSVG"
                    hint="data generation interval">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="teal accent-4" @click="getLogs()" > Get Logs </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="6" class="d-flex" style="flex-direction:column">
        <v-card dark rounded class="flex-grow-1 elevation-0" color="transparent" ref="compassCard">
          <v-container fill-height fluid v-resize="onResize">
            <v-row align="center" justify="center">
              <Compass :value="gaugeValueSVG" :width="320" :height="320" ref="svgCompass"></Compass>
            </v-row>
          </v-container>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import RadialGauge from 'vue2-canvas-gauges/src/RadialGauge'
import LinearGauge from 'vue2-canvas-gauges/src/LinearGauge'
import Compass from '@/components/Compass.vue'
import { ipcRenderer } from 'electron'

export default {
  name: 'Home',
  components: {
    RadialGauge,
    LinearGauge,
    Compass,
  },
  computed: {
    canStartSimulation() {
      return this.inputDataValid
    },
    canStartSimulationLinear() {
      return this.inputDataValidLinear
    },
    canStartSimulationSVG() {
      return this.inputDataValidSVG
    },
    runtimeString() {
      let v = this.runtimeSec

      let hours   = Math.floor(v / 3600)
      let minutes = Math.floor((v - (hours * 3600)) / 60)
      var seconds = v - (hours * 3600) - (minutes * 60)

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return hours+':'+minutes+':'+seconds;
    },
    runtimeStringLinear() {
      let v = this.runtimeSecLinear

      let hours   = Math.floor(v / 3600)
      let minutes = Math.floor((v - (hours * 3600)) / 60)
      var seconds = v - (hours * 3600) - (minutes * 60)

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return hours+':'+minutes+':'+seconds;
    },
    runtimeStringSVG() {
      let v = this.runtimeSecSVG

      let hours   = Math.floor(v / 3600)
      let minutes = Math.floor((v - (hours * 3600)) / 60)
      var seconds = v - (hours * 3600) - (minutes * 60)

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return hours+':'+minutes+':'+seconds;
    },
  },
  data: () => ({
    isSimRunning: false,
    isSimRunningLinear: false,
    isSimRunningSVG: false,
    runtimeSec: 0,
    runtimeSecLinear: 0,
    runtimeSecSVG: 0,
    cardHeight: 320,
    dataGenerationInterval: 200,
    dataGenerationIntervalLinear: 200,
    dataGenerationIntervalSVG: 200,
    inputDataValid: true,
    inputDataValidLinear: true,
    inputDataValidSVG: true,
    gaugeValue: 0,
    gaugeValueLinear: 0,
    gaugeValueSVG: 0,
    gaugeDirLinear: true,
    dataCount: 0,
    dataCountLinear: 0,
    dataCountSVG: 0,
    gaugeOptions: {
      height: 320,
      width: 320,
      title: 'Test',
      units: 'Unit',
      minValue: 0,
      maxValue: 360,
      // majorTicks: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'],
      majorTicks: ['0', '45', '90', '135', '180', '225', '270', '315', '0'],
      minorTicks: 22,
      ticksAngle: 360,
      startAngle: 180,
      strokeTicks: false,
      highlights: false,
      colorPlate: '#33a',
      colorMajorTicks: '#f5f5f5',
      colorMinorTicks: '#ddd',
      colorNumbers: '#ccc',
      colorNeedle: 'rgba(240, 64, 64, 1)',
      colorNeedleEnd: 'rgba(255, 32, 32, .9)',
      colorTitle: '#ffffff',
      colorUnits: '#ffffff',
      valueBox: true,
      valueTextShadow: false,
      needleCircleSize: 5,
      needleCircleOuter: false,
      needleCircleInner: true,
      animationRule: 'linear',
      needleType: 'line',
      needleStart: 75,
      needleEnd: 99,
      needleWidth: 3,
      borders: true,
      borderInnerWidth: 0,
      borderMiddleWidth: 0,
      borderOuterWidth: 8,
      colorBorderOuter: '#ccc',
      colorNeedleShadowDown: '#222',
      borderShadowWidth: 0,
      animationTarget: 'plate',
      useMinPath: true,
      fontTitleSize: 32,
      fontUnitsSize: 32,
      fontValueSize: 32,
      animation: true,
      animationOnInit: false,
      animationDuration: 30,
    },
    gaugeOptionsLinear: {
      width: 160,
      height: 320,
      units: "°C",
      minValue: 0,
      maxValue: 220,
      majorTicks: [
        "0",
        "20",
        "40",
        "60",
        "80",
        "100",
        "120",
        "140",
        "160",
        "180",
        "200",
        "220"
      ],
      minorTicks: 2,
      strokeTicks: true,
      highlights: [
        {
          "from": 100,
          "to": 220,
          "color": "rgba(200, 50, 50, .75)"
        }
      ],
      colorPlate: "#fff",
      borderShadowWidth: 0,
      borders: false,
      needleType: "arrow",
      needleWidth: 2,
      animationDuration: 50,
      animationRule: "linear",
      tickSide: "left",
      numberSide: "left",
      needleSide: "left",
      barStrokeWidth: 7,
      barBeginCircle: false,
    },
    rules: {
      dataInterval: (value) => {
        if(typeof(value) == 'string' && value ==='') {
          return 'Please enter data generation interval'
        }

        let v = value

        if (v < 50 || v > 10000) {
          return `data generation interval must be between 50 and 100`
        }

        return true
      }
    },
    timers: {
      oneSecTimer: null,
      dataGenTimer: null,
      oneSecTimerLinear: null,
      dataGenTimerLinear: null,
      oneSecTimerSVG: null,
      dataGenTimerSVG: null,
    },
  }),
  methods: {
    onResize() {
      let self = this

      let h = self.$refs.compassCard.$el.clientHeight
      let w = self.$refs.compassCard.$el.clientWidth
      let v = h > w ? w : h

      let newOpt = JSON.parse(JSON.stringify(self.gaugeOptions))

      newOpt.height = v
      newOpt.width = newOpt.height

      // this will trigger gauge destroy and new creation
      self.gaugeOptions = newOpt
    },
    getRandom(min, max) {
      let v = Math.random() * (max - min) + min

      v = v.toFixed(2)
      v = parseFloat(v)
      return v;
    },
    generateRandomData() {
      this.dataCount += 1
      this.gaugeValue = this.getRandom(0, 360)
    },
    generateRandomDataLinear() {
      this.dataCountLinear += 1
      /*
      if (this.gaugeDirLinear) {
        this.gaugeValueLinear += 1

        if (this.gaugeValueLinear > this.gaugeOptionsLinear.maxValue) {
          this.gaugeValueLinear = this.gaugeOptionsLinear.maxValue
          this.gaugeDirLinear = false
        }
      } else {
        this.gaugeValueLinear -= 1

        if (this.gaugeValueLinear < this.gaugeOptionsLinear.minValue) {
          this.gaugeValueLinear = this.gaugeOptionsLinear.minValue
          this.gaugeDirLinear = true
        }
      }
      */
     this.gaugeValueLinear = this.getRandom(0, 220)
    },
    generateRandomDataSVG() {
      /*
      let v

      this.dataCountSVG += 1
      v = this.gaugeValueSVG
      v += 1
      if (v >= 360) {
        v = 0
      }
      this.gaugeValueSVG = v
      */
      this.dataCountSVG += 1
      let v = this.getRandom(0, 360)
      if (v === 360) {
        v = 0
      }
      this.gaugeValueSVG = v
      ipcRenderer.invoke('appDB:addLog', {
        time: this.getDateTime(),
        value: v,
      })
    },
    startSimulation() {
      let self = this

      self.dataCount = 0
      self.runtimeSec = 0
      self.gaugeValue = 0

      self.generateRandomData()

      self.timers.dataGenTimer = setInterval(() => {
        self.generateRandomData()
      }, self.dataGenerationInterval)

      self.timers.oneSecTimer = setInterval(() => {
        self.runtimeSec += 1
      }, 1000)

      self.isSimRunning = true
    },
    stopSimulation() {
      let self = this

      clearInterval(self.timers.dataGenTimer)
      clearInterval(self.timers.oneSecTimer)

      self.timers.dataGenTimer = null
      self.timers.oneSecTimer = null

      self.isSimRunning = false
    },
    startSimulationLinear() {
      let self = this

      self.dataCountLinear = 0
      self.runtimeSecLinear = 0
      self.gaugeValueLinear = 0

      self.generateRandomDataLinear()

      self.timers.dataGenTimerLinear = setInterval(() => {
        self.generateRandomDataLinear()
      }, self.dataGenerationIntervalLinear)

      self.timers.oneSecTimerLinear = setInterval(() => {
        self.runtimeSecLinear += 1
      }, 1000)

      self.isSimRunningLinear = true
    },
    stopSimulationLinear() {
      let self = this

      clearInterval(self.timers.dataGenTimerLinear)
      clearInterval(self.timers.oneSecTimerLinear)

      self.timers.dataGenTimerLinear = null
      self.timers.oneSecTimerLinear = null

      self.isSimRunningLinear = false
    },
    startSimulationSVG() {
      let self = this

      self.dataCountSVG = 0
      self.runtimeSecSVG = 0
      self.gaugeValueSVG = 0

      self.generateRandomDataSVG()

      self.timers.dataGenTimerSVG = setInterval(() => {
        self.generateRandomDataSVG()
      }, self.dataGenerationIntervalSVG)

      self.timers.oneSecTimerSVG = setInterval(() => {
        self.runtimeSecSVG += 1
      }, 1000)

      self.isSimRunningSVG = true
    },
    stopSimulationSVG() {
      let self = this

      clearInterval(self.timers.dataGenTimerSVG)
      clearInterval(self.timers.oneSecTimerSVG)

      self.timers.dataGenTimerSVG = null
      self.timers.oneSecTimerSVG = null

      self.isSimRunningSVG = false
    },
    getDateTime() {
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      let day = now.getDate()
      let hour = now.getHours()
      let minute = now.getMinutes()
      let second = now.getSeconds()
      let msec = now.getMilliseconds()

      if (month.toString().length == 1) {
        month = '0' + month
      }
      if (day.toString().length == 1) {
        day = '0' + day
      }
      if (hour.toString().length == 1) {
        hour = '0' + hour
      }
      if (minute.toString().length == 1) {
        minute = '0' + minute
      }
      if (second.toString().length == 1) {
        second = '0' + second
      }
      if (msec.toString().length == 1) {
        msec = '00' + msec
      } else if (msec.toString().length == 2) {
        msec = '0' + msec
      }

      var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second + ':' + msec;
      return dateTime;
    },
    async getLogs() {
      console.log('retrieving logs')
      let { error, rows } = await ipcRenderer.invoke('appDB:getLogs')

      if (error) {
        console.log(`failed to get logs ${error}`)
        return
      }

      console.log(`retrieving logs done ${rows.length}`)
      let ndx = 1

      rows.forEach((row) => {
        console.log(`${ndx}:<${row.time}>, <${row.value}>`)
        ndx += 1
      })
    }
  },
}
</script>
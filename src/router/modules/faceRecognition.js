/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout'

const faceRecognition = {
  path: '/faceRecognition',
  component: Layout,
  name: '人脸识别',
  redirect: '/faceRecognition/index',
  alwaysShow: true,
  meta: {
    title: '人脸识别',
    icon: 'face',
    roles: ['/faceRecognition']
  },
  children: [
    {
      path: '/faceRecognition/index',
      component: () => import('@/views/faceRecognition/index.vue'),
      name: 'index',
      meta: {
        title: '脸库查询',
        roles: ['/faceRecognition/index']
      }
    },
    {
      path: '/faceRecognition/faceCompare',
      component: () => import('@/views/faceRecognition/faceCompare.vue'),
      name: 'index',
      meta: {
        title: '人脸识别',
        roles: ['/faceRecognition/faceCompare']
      }
    },
    {
      path: '/faceRecognition/select',
      component: () => import('@/views/capturePicture/capturePic.vue'),
      name: 'index',
      meta: {
        title: '人脸选取',
        roles: ['/faceRecognition/select']
      }
    }
  ]
}
export default faceRecognition


export default  [
    { path:'/', redirect:'/login'},
    {
        path:'/login',
        component:() => import('@/views/login/Login.vue')
    },
    {
        path:'/home',
        component:() => import('@/views/home/Home.vue')
    }
]
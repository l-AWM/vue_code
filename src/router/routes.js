
export default  [
    { path:'/', redirect:'/login'},
    {
        path:'/login',
        component:() => import('@/views/login/Login.vue')
    },
    {
        path:'/home',
        component:() => import('@/views/home/Home.vue'),
        redirect:'/welcome',
        children:[
            {
                path:'/welcome',
                component:() => import('@/views/home/WelCome.vue')
            },
            {
                path:'/users',
                component:() => import('@/views/home/UserList.vue')
            }
        ]
    }
]
<template>
    <div id="mo_comments">
        <ul>
            <!-- <li  v-for="(index,item) in items" v-link="{path:'/comments/session/'+item.name}"> -->
            <li  v-for="(index,item) in items" v-link="{name:'session' , query: {userId: item.name}}">
                <div class="comments_img"><img :src="item.img" alt="{{user_name}}"></div>
                <div class="comments_info">
                    <span class="comments_name">{{item.name}}</span>
                    <span class="comments_desc">{{item.desc}}</span>
                </div>
            </li>
        </ul>
    </div>
    <router-view></router-view>
</template>
<script>
    export default{
        data () {
            return {
                items : [
                    {
                        img : "http://ww2.sinaimg.cn/crop.0.0.1080.1080.1024/d773ebfajw8eum57eobkwj20u00u075w.jpg",
                        name : "Winysksajdkljaskl;djaskldjsakljdaskldjsakljdaskljklfgjdkgljfdklgj54iowtguldsajfgkklsjfdl",
                        desc : "一个温暖的杀人狂Winysksajdkljaskl;djaskldjsakljdaskldjsakljdaskljklfgjdkgljfdklgj54iowtguldsajfgkklsjfdl"
                    },
                    {
                        img : "http://ww2.sinaimg.cn/crop.0.0.1080.1080.1024/d773ebfajw8eum57eobkwj20u00u075w.jpg",
                        name : "Winys",
                        desc : "一个温暖的杀人狂"
                    },
                    {
                        img : "http://ww2.sinaimg.cn/crop.0.0.1080.1080.1024/d773ebfajw8eum57eobkwj20u00u075w.jpg",
                        name : "Winys",
                        desc : "一个温暖的杀人狂"
                    },
                    {
                        img : "http://ww2.sinaimg.cn/crop.0.0.1080.1080.1024/d773ebfajw8eum57eobkwj20u00u075w.jpg",
                        name : "Winys",
                        desc : "一个温暖的杀人狂"
                    },
                    {
                        img : "http://ww2.sinaimg.cn/crop.0.0.1080.1080.1024/d773ebfajw8eum57eobkwj20u00u075w.jpg",
                        name : "Winys",
                        desc : "一个温暖的杀人狂"
                    },
                    {
                        img : "http://ww2.sinaimg.cn/crop.0.0.1080.1080.1024/d773ebfajw8eum57eobkwj20u00u075w.jpg",
                        name : "Winys",
                        desc : "一个温暖的杀人狂"
                    },
                    {
                        img : "http://ww2.sinaimg.cn/crop.0.0.1080.1080.1024/d773ebfajw8eum57eobkwj20u00u075w.jpg",
                        name : "Winys",
                        desc : "一个温暖的杀人狂"
                    }
                ]
            }
        }
    }
</script>
<style>
    #mo_comments{
        width: 300px;
        background: #F4F4F4;
        flex-shrink:0;
        flex-grow: 0;
        overflow: auto;
        border-right: 1px solid #dddcdd;
    }
    #mo_comments ul{
        list-style: none;
    }
    #mo_comments ul li{
        background: #F5F9FF;
        padding: 5px;
    }
    #mo_comments ul li:hover{
        background-color: #e5f0fa;
    }
    #mo_comments ul li.v-link-active{
        background-color: #d5edfe;
    }
    .comments_img {
        display: inline-block;
        vertical-align: top;
    }
    .comments_info{
        display: inline-block;
        vertical-align: top;
        padding: 5px;
    }
    .comments_info span{
        max-width: 150px;
        display: block;
        overflow: hidden;
        white-space:nowrap;        
        text-overflow: ellipsis;
     }
    .comments_img img{
        width: 80px;
        height :80px;
        border-radius: 40px;
    }
    
    .comments_name{
       height: 40px;
       line-height: 40px;
    }
    .comments_desc{
        font-size: 12px;
        color: #484848;
    }
</style>
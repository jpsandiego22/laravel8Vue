<template>
    <div>
        <video-js controls preload="auto" ref="vplayer" class="video-js vjs-big-play-centered">
            Your browser does not support the video tag.
        </video-js>
    </div>
</template>
<script>
import videojs from "video.js";
export default {
    props:['video'],
    name:'videosClass',
    data() {
        return {
            videoPlayer:'',
        }
    },
    mounted(){
        this.videosClass()
    },
    methods:{
        videosClass(){
            
            const element = this.$refs['vplayer'];
            this.videoPlayer = videojs(element,{
                fluid:true,
                muted:true,
                sources:this.video,
                type:"video/mp4",
                autoplay: true,
            })
        }
    }
}

</script>
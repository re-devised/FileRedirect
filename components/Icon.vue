<template>
    <svg v-if="icon" xmlns="http://www.w3.org/2000/svg" :class="color" :fill="fillColor" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" :stroke-width="width" :d="svgIcon" />
    </svg>
</template>

<script>
export default {
    props: {
        icon: {
            type: String,
        },
        color: {
            type: String
        },
        width: {
            type: Number,
            default: 2
        },
        isFilled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        svgIcon(){
            if(this.icon == "download"){
                return "M17 13l-5 5m0 0l-5-5m5 5V6"
            }else if(this.icon == "upload"){
                return "M7 11l5-5m0 0l5 5m-5-5v12"
            }else if(this.icon == "check"){
                return "M5 13l4 4L19 7"
            }else if(this.icon == "cross"){
                return "M6 18L18 6M6 6l12 12"
            }else if(this.icon == "bookmark"){
                return "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            }
        },
        fillColor(){
            if(this.isFilled) return "currentColor"
            else return "none"
        }
    }
}

</script>
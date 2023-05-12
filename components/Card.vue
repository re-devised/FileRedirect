<template>
    <div class="bg-gray-200 h-12 rounded-full p-2 flex flex-shrink-0 align-middle relative overflow-hidden">

        <div class="border-4 rounded-full h-8 w-8 flex-shrink-0" :class="statusColor('border')">
            <icon :icon="statusIcon" :class="statusColor('text')" />
        </div>


        <div class="flex flex-col overflow-hidden ml-2 mr-1 text-xs text-gray-500 flex-shrink">
            <div class="whitespace-nowrap font-light">{{url}}</div>
            <div class="whitespace-nowrap font-bold">{{fileName}}</div>
        </div>


        <div class="uppercase text-xs font-bold absolute right-0 bottom-0 px-4
        bg-gray-400 bg-opacity-50 rounded-tl-xl text-gray-500">
        {{statusResponse != '' ? statusResponse : fileType}}</div>

        <div class="absolute flex w-full h-full right-0 top-0 removeButton" :class="{'hidden' : running}">
            <div class="bg-gray-700 w-full h-full rounded-full opacity-90 hidden border-2 border-warning justify-evenly">
                <button @click.prevent="emitFavoriteUrl" @blur="isMenuOpened = false"
                class="focus:outline-none justify-center items-center w-1/5 flex justify-center">
                    <icon icon="bookmark" class="text-warning h-6 w-6" :isFilled="isFavorite"/>
                </button>
                <button @click.prevent="emitRemoveUrl" @blur="isMenuOpened = false"
                class="focus:outline-none justify-center items-center w-1/5 flex justify-center">
                    <icon icon="cross" class="text-warning h-6 w-6" />
                </button>
            </div>
        </div>
    </div>
</template>


<script>
import mobile from 'is-mobile'
export default {
    data() {
        return {
            isMenuOpened: false
        }
    },
    props: {
        url : {
            type: String,
            required: true
        },
        fileName: {
            type: String
        },
        fileType: {
            type: String
        },
        status: {
            type: String,
            default: ''
        },
        statusResponse: {
            type: String,
            default: ''
        },
        running: {
            type: Boolean,
            default: false
        },
        favoriteUrls: {
            type: Array
        }
    },
    computed: {
        statusIcon(){
            if(this.statusResponse.includes('Succeed')){
                return "check"
            }else if(this.statusResponse.includes('Code')){
                return "cross"
            }else if(this.status == 'download'){
                return "download"
            }else if(this.status == 'upload'){
                return "upload"
            }else return ""
        },
        isMobile(){
            return mobile()
        },
        isFavorite(){
            if(!this.favoriteUrls) return false
            for(const favoriteUrl of this.favoriteUrls){
                if(favoriteUrl.url == this.url) return true
            }
            return false
        }
    },
    methods: {
        statusColor(stylePart){
            if(this.statusResponse.includes('Succeed')){
                return stylePart + "-accent1-300"
            }else if(this.statusResponse.includes('Code')){
                return stylePart + "-warning"
            }else if(this.status == 'download' || this.status == 'upload'){
                return stylePart + "-accent2"
            }else return stylePart + "-gray-300"
        },
        emitRemoveUrl(){
            if(this.isMobile && !this.isMenuOpened){
                this.showMenu()
                return
            }
            this.$emit('urlRemoveButtonClicked')
        },
        emitFavoriteUrl(){
            if(this.isMobile && !this.isMenuOpened){
                this.showMenu()
                return
            }
            this.$emit('urlFavoriteButtonClicked')
        },
        showMenu(){
            this.isMenuOpened = true
        }
    },
}
</script>

<style>
    ::-webkit-scrollbar{
        width: 4px;
    }
    ::-webkit-scrollbar-thumb{
        background: rgba(0, 0, 0, 0.2);
        border-radius: 100px;
    }

    .removeButton:hover div {
        @apply flex !important;
    }
</style>
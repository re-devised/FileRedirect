<template>
    <nav class="z-20 absolute left-0 bg-background w-screen top-0 md:relative 
                md:p-6 md:w-full py-12 px-8 md:border-r md:border-primary-200 md:min-h-screen"
         :class="{'h-screen' : menu}">

        <div class="flex justify-between items-center">
            <h1 class="uppercase text-2xl">
                <a class="text-primary-100 hover:text-primary-200" href="/">File<span class="font-bold">Redirect</span></a>
            </h1>
            <div class="cursor-pointer md:hidden" @click="menu = !menu">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </div>
        </div>
        <ul class="text-sm text-primary-100 mt-6 md:block" :class="{hidden : !menu}">
            <li class="py-1">
                <a href="#" class="flex uppercase hover:text-primary-200">
                    <span>Documentation</span>
                </a>
            </li>
            <li class="py-1">
                <a href="#" class="flex uppercase hover:text-primary-200">
                    <span>NPM Package</span>
                </a>
            </li>
            <!-- <li class="py-1">
                <a href="#" class="flex uppercase hover:text-primary-200">
                    <span>API</span>
                </a>
            </li> -->

            <li class="py-1 mt-20 uppercase flex flex-col">
                <span v-if="favoriteUrls && (favoriteUrls.getUrl.length > 0 || favoriteUrls.postUrl.length > 0)">Favorites</span>
                <span class="mt-4 font-thin" v-if="favoriteUrls && favoriteUrls.getUrl.length > 0">
                    GetUrls</span>
                <div class="mt-2">
                    <button
                    v-for="(url, index) in favoriteUrls.getUrl"
                    :key="index"
                    @click="addFavoriteToUrlArray(url.url, 'get', index)"
                    class="uppercase px-0 py-1 flex italic font-bold hover:text-primary-200"
                    :class="{'animate-slide' : clickAnimations.includes(`get-${index}`)}">
                        <span class="mr-3">==</span>
                        <span>{{(url.name ? url.name : url.url) | shortenText(18)}}</span>
                        <span class="mx-3">-</span><span class="underline">add</span>
                    </button>
                </div>
                <span class="mt-4 font-thin" v-if="favoriteUrls && favoriteUrls.postUrl.length > 0">
                    PostUrls</span>
                <div class="mt-2">
                    <button 
                    v-for="(url, index) in favoriteUrls.postUrl"
                    :key="index"
                    @click="addFavoriteToUrlArray(url.url, 'post', index)"
                    class="uppercase px-0 py-1 flex italic font-bold hover:text-primary-200"
                    :class="{'animate-slide' : clickAnimations.includes(`post-${index}`)}">
                        <span class="mr-3">==</span>
                        <span>{{(url.name ? url.name : url.url) | shortenText(18)}}</span>
                        <span class="mx-3">-</span><span class="underline">add</span>
                    </button>
                </div>
            </li>
        </ul>
    </nav>
</template>

<script>
import wait from 'wait';
export default {
    data() {
        return {
            menu: true,
            clickAnimations: [0]
        }
    },
    props: {
        favoriteUrls: {
            type: Object
        }
    },
    methods: {
        async addFavoriteToUrlArray(url, method, index){

            if(method == "get"){
                this.clickAnimations.push("get-" + index)

                await wait(200)
                this.$emit('addFavoriteButtonClicked', [url, method])
                await wait(300)

                let animationIndex = this.clickAnimations.findIndex(e => e == "get-" + index)
                this.clickAnimations.splice(animationIndex, 1)
            }
            if(method == "post"){
                this.clickAnimations.push("post-" + index)

                await wait(200)
                this.$emit('addFavoriteButtonClicked', [url, method])
                await wait(300)

                let animationIndex = this.clickAnimations.findIndex(e => e == "post-" + index)
                this.clickAnimations.splice(animationIndex, 1)
            }

        }
    }
}
</script>
<template>
  <div class="md:grid md:grid-cols-12 h-full relative overflow-x-hidden">
    
    <side-nav class="md:col-span-3" :favoriteUrls="favoriteUrls" @addFavoriteButtonClicked="pushFavoriteToUrlArray"/>

    <main class="bg-primary-100 min-h-screen h-full md:col-start-5 md:col-end-13">
      <div class="pt-40 md:pt-20 pb-20 flex flex-col h-full">

        <div class="grid md:grid-cols-2 gap-3 px-8 py-3">
          <!-- INPUT FIELDS -->
          <textarea v-model="form.getUrl" @keydown.enter.prevent="pushElementToUrlArray" @input="pushSpacesplittedElementsToUrlArray"
            name="getUrl" id="getUrl" placeholder="urls to get ===> https://..."
            class="p-2 bg-transparent border border-gray-200 rounded-lg text-gray-200 text-sm
            resize-y outline-none overflow-auto"
          ></textarea>
          <textarea v-model="form.postUrl" @keydown.enter.prevent="pushElementToUrlArray" @input="pushSpacesplittedElementsToUrlArray"
            name="getUrl" id="getUrl" placeholder="urls to post to ===> https://..."
            class="p-2 bg-transparent border border-gray-200 rounded-lg text-gray-200 text-sm
            resize-y outline-none overflow-auto"
          ></textarea>
        </div>

        <div class="mt-4 md:mt-8 md:grid md:grid-cols-2 gap-3 px-8 py-3 w-full overflow-z-auto">
          <!-- CARDS -->

          <div class="flex flex-col gap-1"> <!-- GETURLS -->
            <div v-show="urlArray.getUrl.length > 0" class="mb-2 border-b-2 border-primary-200 font-bebas w-96 flex">Geturls</div>
            <card 
              v-for="(getUrl, index) in urlArray.getUrl"
              :key="index"
              :url="getUrl"
              :fileName="extractFileNameFromUrl(getUrl)"
              :fileType="extractFileTypeFromUrl(getUrl)"
              :statusResponse="getStatusResponse('get', getUrl)"
              :running="redirectRunning"
              :favoriteUrls="favoriteUrls.getUrl"
              @urlRemoveButtonClicked="urlArray.getUrl.splice(index, 1)"
              @urlFavoriteButtonClicked="toggleUrlInFavoriteStorage(getUrl, 'get')"
            />
          </div>
          

          <div class="flex flex-col gap-1"> <!-- POSTURLS -->
            <div v-show="urlArray.postUrl.length > 0" class="my-2 md:mt-0 border-b-2 border-primary-200 font-bebas w-32 flex">Posturls</div>
            <card 
              v-for="(postUrl, index) in urlArray.postUrl"
              :key="index"
              :url="postUrl"
              :statusResponse="getStatusResponse('post', postUrl)"
              :running="redirectRunning"
              :favoriteUrls="favoriteUrls.postUrl"
              @urlRemoveButtonClicked="urlArray.postUrl.splice(index, 1)"
              @urlFavoriteButtonClicked="toggleUrlInFavoriteStorage(postUrl, 'post')"
            />
          </div>

        </div>
      </div>
    </main>

    <redirect-button @buttonClicked="redirectFiles" :running="redirectRunning" />
  </div>
</template>

<script>
import { Storage } from '@capacitor/storage';
import allowedFormats from '~/plugins/allowedFormats.js'
export default {
  data() {
    return {
      form: {
        getUrl: '',
        postUrl: 'YOUR API URL'
      },
      urlArray: {
        getUrl: [],
        postUrl: []
      },
      favoriteUrls: {
        getUrl: [],
        postUrl: []
      },
      buttonActive: false
    }
  },
  async created(){
    const { value } = await Storage.get({ key: 'favoriteUrls' });
    if(value) this.favoriteUrls = JSON.parse(value)
  },
  computed: {
    redirectProgress(){
      return this.$store.state.redirect.redirectProgress
    },
    redirectRunning(){
      return this.$store.state.redirect.running
    },
    urlPrefix(){
      return this.$store.state.redirect.urlPrefix
    }
  },
  methods: {
    redirectFiles(){
      this.$store.dispatch('redirect/redirectFiles', [this.urlArray.getUrl, this.urlArray.postUrl])
      this.$store.dispatch('redirect/updateProgress')
    },
    async toggleUrlInFavoriteStorage(url, method){
      var isNew = true
      if(method == "get"){
        for(const [index, getUrl] of this.favoriteUrls.getUrl.entries()){
          if(getUrl.url == url){
            this.favoriteUrls.getUrl.splice(index, 1)
            isNew = false
            break
          }
        }
        if(isNew){
          let urlObject = {}
          urlObject.url = url
          
          let urlNickname = window.prompt("Please enter a name for the URL to make it easier for you to recognize it later on.");
          if(urlNickname != null || urlNickname != "") urlObject.name = urlNickname
          
          this.favoriteUrls.getUrl.push(urlObject)        
        }
      } 
      if(method == "post"){
        for(const [index, postUrl] of this.favoriteUrls.postUrl.entries()){
          if(postUrl.url == url){
            this.favoriteUrls.postUrl.splice(index, 1)
            isNew = false
            break
          }
        }
        if(isNew){
          let urlObject = {}
          urlObject.url = url
          
          let urlNickname = window.prompt("Please enter a name for the URL so you can later recognise it better");
          if(urlNickname != null || urlNickname != "") urlObject.name = urlNickname
          
          this.favoriteUrls.postUrl.push(urlObject)      
        }
      } 

      await Storage.set({
        key: 'favoriteUrls',
        value: JSON.stringify(this.favoriteUrls)
      });
    },
    getStatusResponse(requestType, url){
      var prefixedUrl = this.urlPrefix ? this.urlPrefix + url : url

      if(requestType == 'get'){
        let getUrlResponse = this.redirectProgress.getUrl.find(response => response.url == prefixedUrl)
        if(getUrlResponse){
          if(getUrlResponse.status == 200) return "Succeed"
          else return "Code " + getUrlResponse.status
        } 
        else return ''

      }else if(requestType == 'post'){
        let postUrlResponse = this.redirectProgress.postUrl.find(response => response.url == prefixedUrl)
        let getUrlsResponseSucceeded = this.redirectProgress.getUrl.filter(url => url.status == 200).length

        if(postUrlResponse){
          // let totalPostRequests = postUrlResponse.postRes.length
          let successfulPostRequests = postUrlResponse.postRes.filter(response => response.status == 200).length
          if(successfulPostRequests == 0){
            return successfulPostRequests + "/" + getUrlsResponseSucceeded  
          }else return "Succeed " + successfulPostRequests + "/" + getUrlsResponseSucceeded
        }
        else return ''

      }else return ''
    },
    extractFileNameFromUrl(url){
      var lastPartOfUrl = url.substring(url.lastIndexOf('/') + 1)
      var formatOfLastPartOfUrl = lastPartOfUrl.substring(lastPartOfUrl.lastIndexOf('.') + 1)

      for(var format of allowedFormats){
        let formattedFormat = format.match(/[^/]*$/)[0]
        if(formatOfLastPartOfUrl == formattedFormat) return lastPartOfUrl
      }
      return ''
    },
    extractFileTypeFromUrl(url){
      var lastPartOfUrl = url.substring(url.lastIndexOf('/') + 1)
      var formatOfLastPartOfUrl = lastPartOfUrl.substring(lastPartOfUrl.lastIndexOf('.') + 1)

      for(var format of allowedFormats){
        let formattedFormat = format.match(/[^/]*$/)[0]
        if(formatOfLastPartOfUrl == formattedFormat) return formattedFormat
      }
      return 'Download'
    },
    pushElementToUrlArray(){
      this.pushSpacesplittedElementsToUrlArray()
      if(this.form.getUrl != ''){
        this.urlArray.getUrl.push(this.form.getUrl.replace(/\s/g,''))
        this.form.getUrl = ''
      }
      if(this.form.postUrl != ''){
        this.urlArray.postUrl.push(this.form.postUrl.replace(/\s/g,''))
        this.form.postUrl = ''
      }
    },
    pushFavoriteToUrlArray([url, method]){
      if(method == "get"){
        this.urlArray.getUrl.push(url.replace(/\s/g,''))
      }
      if(method == "post"){
        this.urlArray.postUrl.push(url.replace(/\s/g,''))
      }
    },


    pushSpacesplittedElementsToUrlArray(){
      if(this.form.getUrl != ''){
        while(this.form.getUrl.indexOf(' ') > -1 || this.form.getUrl.indexOf('\n') > -1){ //while there are spaces in textarea, enter the url parts into the urlArray

          this.urlArray.getUrl.push(this.form.getUrl.split(' ')[0].split('\n')[0])
          this.form.getUrl = this.form.getUrl.substring(this.form.getUrl.indexOf(' ') + 1, this.form.getUrl.length)
                                             .substring(this.form.getUrl.indexOf('\n') + 1, this.form.getUrl.length)
        }
        this.form.getUrl.replace(/\s/g,'')//replace = trim all whitespaces
      }
      if(this.form.postUrl != ''){
        while(this.form.postUrl.indexOf(' ') > -1 || this.form.getUrl.indexOf('\n') > -1){

          this.urlArray.postUrl.push(this.form.postUrl.split(' ')[0].split('\n')[0])
          this.form.postUrl = this.form.postUrl.substring(this.form.postUrl.indexOf(' ') + 1, this.form.postUrl.length)
                                               .substring(this.form.postUrl.indexOf('\n') + 1, this.form.postUrl.length)
        }
        this.form.postUrl.replace(/\s/g,'')//replace = trim all whitespaces
      }
    }
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
/*.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}*/
</style>

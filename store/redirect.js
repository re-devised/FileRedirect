import {getFileThenPost, getProgress} from '~/plugins/redirect'
// import getFileThenPost from 'get-file-then-post'

export const state = () => {
    return {
        urlPrefix: '',
        running: false,
        redirectProgress: {
            getUrl: [],
            postUrl: []
        }
    }
}

export const actions = {

    async redirectFiles({commit, state}, [getUrl, postUrl]){
        commit('resetProgress')
        commit('changeProcessStatus', true)
        await getFileThenPost({
            'getUrl' : getUrl,
            'postUrl' : postUrl,
            'prefix' : state.urlPrefix
        })
        commit('changeProcessStatus', false)
    },
    updateProgress({commit, dispatch, state}){
        // console.log(JSON.parse(JSON.stringify(getProgress())))
        commit('setProgress', getProgress())

        if(state.running){
            sleep(300).then(() => {
                dispatch('updateProgress')
            }); 
        }
    }
}

export const mutations = {
    changeProcessStatus(state, bool){
        state.running = bool
    },
    setProgress(state, progessReturnObject){
        state.redirectProgress = progessReturnObject
    },
    resetProgress(state){
        state.redirectProgress.getUrl = []
        state.redirectProgress.postUrl = []
    }
}





function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
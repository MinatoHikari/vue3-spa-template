import process from 'node:process'
import axios from 'axios'
import { loadEnv } from 'vite'

const env = loadEnv('production', `${process.cwd()}/viteEnv`, '')
const url = env.TEST_DEPLOY_URL
const token = env.TEST_DEPLOY_TOKEN
if (url && token) {
    axios.post(
        env.TEST_DEPLOY_URL,
        {
            branch: 'dev',
        },
        {
            headers: {
                'X-Gitlab-Token': env.TEST_DEPLOY_TOKEN,
            },
        },
    )
}

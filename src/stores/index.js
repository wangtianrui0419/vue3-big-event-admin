import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

export * from './modules/count'
export * from './modules/user'

const pinia = createPinia()
pinia.use(persist)
export default pinia
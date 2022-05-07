import { defineComponent, ref } from 'vue';
import { useCommonStore } from '~/stores/common';

export default defineComponent({
    setup() {
        const router = useRouter();
        const commonStore = useCommonStore();

        const formData = ref({
            password: '',
            userName: '',
        });

        const login = () => {
            commonStore.setAuthToken('tokenSS');
            router.push('/main/example');
        };

        return {
            formData,
            login,
        };
    },
});

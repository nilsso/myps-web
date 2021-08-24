<template>
    <a
        v-if="isExternalLink"
        v-bind="$attrs"
        :href="to"
        target="_blank"
        class="btn-inv text-xl"
    >
        <slot />
    </a>
    <router-link
        v-else
        v-bind="$props"
        custom
        v-slot="{ isActive, href, navigate }"
    >
        <a
            v-bind="$attrs"
            :href="href"
            @click="navigate"
            :class="[isActive ? 'btn-blue' : 'btn-blue-inv', 'text-xl']"
        >
            <slot />
        </a>
    </router-link>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
    name: 'AppLink',
    inheritAttrs: false,
    props: {
        ...RouterLink.props,
    },
    computed: {
        isExternalLink() {
            return typeof this.to === 'string' && this.to.startsWith('http');
        },
    },
}
</script>

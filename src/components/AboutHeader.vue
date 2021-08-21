<template>
    <div class="header">
        <a :href="href">
            <h{{level}}>
            </h{{level}}>
            <slot />
            <span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 inline"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656
                        5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                </svg>
            </span>
        </a>
    </div>
</template>

<script>
export default {
    props: {
        level: {
            type: Number,
            require: true
        },
        id: {
            type: String,
            required: true
        }
    },
    computed: {
        href() {
            return '#' + this.id
        }
    }
}
</script>

<style lang="postcss">
.header {
    @apply overflow-hidden my-4;
    h1, h2, h3, h4, h5, h6 {
        @apply my-0 inline;
    }
}
</style>

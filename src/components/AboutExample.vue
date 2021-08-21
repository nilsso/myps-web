<template>
    <template v-if="rhs">
        <div class="example relative">
            <div class="grid grid-cols-2 auto-rows-auto divide-x divide-gray-600">
                <highlightjs
                    :code="lhs"
                />
                <highlightjs
                    :code="rhs"
                />
            </div>
            <router-link
                :to="{ name: 'Editor', hash: '#abc' }"
                class="absolute top-0 right-1/2 text-sm my-3e mx-2 text-gray-500 fill-current"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 hover:text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                </svg>
            </router-link>
        </div>
    </template>
    <template v-else>
        <div>
            <highlightjs
                class="w-1/2 mx-auto"
                :code="lhs"
            />
        </div>
    </template>
</template>

<script>
export default {
    name: 'Example',
    data() {
        const getSlotText = slot => {
            const getSlotChildrenText = children => {
                return children.map(node => {
                    if (!node.children || typeof node.children === 'string')
                        return node.children || ''
                    else if (Array.isArray(node.children))
                        return getSlotChildrenText(node.children)
                    else if (node.children.default)
                        return getSlotChildrenText(node.children.default())
                }).join('')
            }

            return slot && getSlotChildrenText(slot()) || ''
        }

        return {
            lhs: getSlotText(this.$slots.default),
            rhs: getSlotText(this.$slots.rhs)
        }
    },
}
</script>

<style lang="postcss">
.example {
    @apply my-4;
}
pre {
    .hljs {
        @apply h-full select-all;
    }
    &:first-child .hljs {
        @apply rounded-l-lg;
    }
    &:last-child .hljs {
        @apply rounded-r-lg;
    }
}
</style>

<template>
    <template v-if="rhs">
        <div class="relative my-4 grid grid-cols-2 auto-rows-auto">
            <pre
                ref="lhs"
                class="border-r border-gray-500 select-all"
                v-highlightjs="lhs"
            ><code class="myps h-full rounded-l-lg shadow-lg" /></pre>
            <router-link
                :to="{ name: 'Editor', hash: '#abc' }"
                class="absolute top-0 right-1/2 mx-2 my-1 text-gray-500 fill-current"
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
            <pre
                ref="rhs"
                v-highlightjs="rhs"
            ><code class="mips h-full rounded-r-lg shadow-lg select-all" /></pre>
        </div>
    </template>
    <template v-else>
        <div>
            <pre
                ref="lhs"
                class="w-1/2 mx-auto"
                v-highlightjs="lhs"
            ><code class="myps rounded-lg shadow-lg select-all"></code></pre>
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

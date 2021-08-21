<script>
import { h } from 'vue'

const levelProps = Object.fromEntries(['one', 'two', 'three', 'four', 'five', 'six']
    .map(k => [k, { type: Boolean, default: false }]))

const path = h('path', {
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    'stroke-width': "2",
    d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
})

const LinkIcon = h('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
}, path)

export default {
    name: 'BaseHeaderTag',
    render: function() {
        return h('h' + this.level, [
            this.$slots.default(),
            h('span', LinkIcon)
        ])
    },
    props: {
        level: {
            type: Number | null,
            default: null
        },
        id: {
            type: String,
            default: ''
        },
        ...levelProps
    },
    setup(props) {
        if (props.one  ) return Object({ level: 1 })
        if (props.two  ) return Object({ level: 2 })
        if (props.three) return Object({ level: 3 })
        if (props.four ) return Object({ level: 4 })
        if (props.five ) return Object({ level: 5 })
        if (props.six  ) return Object({ level: 6 })
    }
}
</script>

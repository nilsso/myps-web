<template>
    <div id="guide-container">
        <Markdown
            v-once
            :toc="markdownToc"
            :source="guideSrc"
            :html="true"
        />
    </div>
</template>

<script>
import Markdown from 'vue3-markdown-it';
import 'highlight.js/styles/nord.css';

import guideSrcRaw from '../about-guide.md';

const guideSrc = guideSrcRaw.replaceAll(
    /(`{3}\w*\n[^`]+\n`{3}\n)(`{3}\w*\n[^`]+\n`{3})/g,
    (_, lhs, rhs) => `
<div class="guide-example">
<div class="lhs">

${lhs}
</div>
<div class="rhs">

${rhs}

</div>
</div>`);

const markdownToc = {
    level: 2,
    listType: "ul",
};

export default {
    name: 'AboutGuide',
    components: { Markdown },
    setup() {
        return {
            guideSrc: guideSrc,
            markdownToc: markdownToc,
        }
    },
    /* data() { */
    /*     return { */
    /*         guideSrc: guideSrc, */
    /*         markdownToc: markdownToc, */
    /*     } */
    /* }, */
}
</script>

<style>
#guide-container {
    margin-left: 20%;
    margin-right: 20%;
    /* margin: 0 20%; */
}
pre {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    background: #2e3440;
    border-radius: 5px;
    padding: 1em;
    box-shadow: 2px 2px 5px #2e344055;
}
code {
    padding: 0 !important;
}
.guide-example {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1em;
}
.guide-example pre {
    width: revert;
}
.hljs {
    border-radius: 5pt;
}
table {
    margin-left: auto;
    margin-right: auto;
}
</style>

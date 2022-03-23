<template lang="pug">
div
  .script-name {{ displayName }}
  .codes-wrap
    pre.diff-line(
      v-for="diffDatum in diffData",
      :key="line",
      :class="diffClass(diffDatum)"
    )
      .diffmark
        span(v-if="diffDatum.added") +
        span(v-else-if="diffDatum.removed") -
        span(v-else) &nbsp;
      span(v-html="syntaxHighlight(diffDatum.value, diffDatum.lang)")
</template>

<script lang="ts">
import Vue from "vue";
import * as diff from "diff";
// @ts-ignore
import Prism from "~/plugins/prism";

export default Vue.extend({
  name: "DiffLines",
  props: {
    prefix4Load: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    beforeV: {
      type: String,
      required: true,
    },
    afterV: {
      type: String,
      required: true,
    },
  },
  async created() {
    const extMatch = this.name.match(/\.[a-z]*/g);
    const ext = extMatch ? extMatch[0].substring(1) : "";
    const [beforeName, afterName] = [this.beforeV, this.afterV].map(
      (ver) => `${this.name}/${ver}.${ext}`
    );
    const baseUrl = "http://localhost:3000/diff-codes/";
    console.log(`${baseUrl}${this.prefix4Load}${beforeName}`)
    const [beforeText, afterText] = await Promise.all(
      [beforeName, afterName].map((each) =>
        fetch(`${baseUrl}${this.prefix4Load}${each}`).then((res) => res.text())
      )
    );
    const diffData = diff
      .diffLines(beforeText, afterText)
      .map((diffDatum) =>
        diffDatum.value
          .split("\n")
          .slice(0, -1)
          .map((eachValue) => ({
            ...diffDatum,
            lang: this.ext2LangName(ext),
            value: eachValue,
          }))
      )
      .flat();
    
    // 特定のコードのみを表示したいとき、行数を書かずに始まりの表現と終わりの表現を書くだけで自動的に抽出してくれる機構を作りたかった。が間に合わず
    // ここからその記述

    // if(this.beginExps) {
    //   const hoge = (this.beginExps as string[]).reduce(((acc, cur, ri) => {
    //     if(!acc.done){
    //       if(ri === 0) {
    //         const fi = diffData.findIndex(diffDatum => diffDatum.value.includes(cur))
    //         if(fi=== -1){
    //           acc.done = true
    //         }
    //         else {
    //           acc.startIndex = fi
    //           acc.endIndex = fi
    //         }
    //       }else {
    //         if (diffData[acc.startIndex+ri].value.includes(cur)) {
    //           acc.endIndex = acc.startIndex+ri
    //         } else {
    //           acc.done = true
    //         }
    //       }
    //     }
    //     return acc
    //   }, {
    //     startIndex: -1,
    //     endIndex: -1,
    //     done: false,
    //   });
    // }

    // ここまでその記述

    this.diffData = diffData;
  },
  data() {
    return {
      diffData: [] as any[],
    };
  },
  methods: {
    diffClass(diffDatum: {
      count: number;
      added?: boolean;
      removed?: boolean;
      value: string;
    }) {
      if (diffDatum.added) return "added";
      else if (diffDatum.removed) return "removed";
      else return "";
    },
    syntaxHighlight(content: string, lang: string) {
      return Prism.highlight(content, Prism.languages[lang], lang);
    },
    ext2LangName(ext: string) {
      switch (ext) {
        case "js":
          return "javascript";
        default:
          return ext;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.script-name {
  display: inline-block;
  background: palegoldenrod;
}
.codes-wrap {
  border: 2px solid orange;
}
.diff-line {
  margin: 0;
  &.added {
    background: yellowgreen;
  }
  &.removed {
    background: pink;
  }
}

.diffmark {
  display: inline-block;
  width: 1em;
  font-family: Menlo;
  color: white;
  .added > & {
    background: green;
  }
  .removed > & {
    background: red;
  }
}
</style>
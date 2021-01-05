<template>
  <div class="el-tabs__header is-top">
    <div class="el-tabs__nav-wrap is-top">
      <div class="el-tabs__nav-scroll">
        <div role="tablist" class="el-tabs__nav is-top" style="transform: translateX(0px);">
          <div class="el-tabs__active-bar is-top" style="width: 56px; transform: translateX(0px);" />
          <div id="tab-first" aria-controls="pane-first" role="tab" aria-selected="true" tabindex="0" class="el-tabs__item is-top is-active">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

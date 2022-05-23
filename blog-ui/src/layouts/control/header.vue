<template>
    <t-header class="ry">
        <t-head-menu value="item1">
            <template #logo>
                <img width="40" class="logo" src="/favicon.ico" alt="logo" />
                <div class="logo">Y</div>
                <!-- <div class="logo"></div> -->
            </template>

            <template #operations>
                <a href="javascript:;">
                    <t-icon class="t-menu__operations-icon" name="search" />
                </a>
                <t-dropdown :min-column-width="88" trigger="click">
                    <t-button variant="text"> 下拉菜单 </t-button>
                    <template #dropdown>
                        <t-dropdown-menu>
                            <t-dropdown-item :value="1"> 操作一 </t-dropdown-item>
                            <t-dropdown-item :value="2"> 操作二 </t-dropdown-item>
                        </t-dropdown-menu>
                    </template>
                </t-dropdown>
                <a href="javascript:;">
                    <t-icon class="t-menu__operations-icon" name="notification-filled" />
                </a>
                <a href="javascript:;">
                    <t-icon class="t-menu__operations-icon" name="home" />
                </a>
            </template>
        </t-head-menu>
    </t-header>
</template>

<style scoped lang="scss">
@import '@/style/variables.scss';

:deep(.t-head-menu__inner) {
    border-bottom: 1px solid $border-level-1-color;
}

.logo {
    margin-left: 24px;
}
</style>
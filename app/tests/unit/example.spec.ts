import { beforeEach, describe, it, expect } from "vitest";
import { config, shallowMount } from "@vue/test-utils";
import HomePage from "@/components/pages/HomePage.vue";
import vuetify from '@/plugins/vuetify';
import { createPinia, setActivePinia } from "pinia";

describe("HomePage.vue", () => {
  beforeEach(() => {
    config.global.plugins = [vuetify]
    setActivePinia(createPinia());
  })
  it("renders props.msg when passed", () => {
    const action = "new action";
    const wrapper = shallowMount(HomePage, {
      props: { action }
    });
    expect(wrapper).is.not.null;
  })
})

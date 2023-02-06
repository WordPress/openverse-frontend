import { fireEvent, render, screen } from "@testing-library/vue"
import Vue from "vue"

import VLink from "~/components/VLink.vue"

const nuxtContextMock = {
  $nuxt: { context: { app: { localePath: jest.fn((v) => v) } } },
}

describe("VLink", () => {
  it.each`
    href                        | target      | rel
    ${"/about"}                 | ${null}     | ${null}
    ${"http://localhost:8443/"} | ${"_blank"} | ${"noopener noreferrer"}
  `(
    "Creates a correct link component based on href",
    ({ href, target, rel }) => {
      render(VLink, {
        props: { href },
        slots: { default: "Code is Poetry" },
        mocks: nuxtContextMock,
      })
      const link = screen.getByRole("link")
      const expectedHref = href.startsWith("/")
        ? `http://localhost${href}`
        : href
      expect(link.href).toEqual(expectedHref)
      expect(link.getAttribute("target")).toEqual(target)
      expect(link.getAttribute("rel")).toEqual(rel)
    }
  )
  it.each`
    href                  | component
    ${"/about"}           | ${"NuxtLink"}
    ${"http://localhost"} | ${"A"}
  `("VLink as a $component handles click", async ({ href, component }) => {
    const createVLinkWrapper = (href) =>
      // eslint-disable-next-line vue/one-component-per-file
      Vue.component("VLinkWrapper", {
        data: () => ({ text: "Link Text" }),
        methods: {
          handleClick(e) {
            e.preventDefault()
            this.text = "Code is Poetry"
          },
        },
        template: `<div><VLink href="${href}" @click="handleClick">{{ text }}</VLink></div>`,
      })
    const WrapperComponent = createVLinkWrapper(href)
    render(WrapperComponent, { mocks: nuxtContextMock }, (localVue) => {
      localVue.component("VLink", VLink)
    })
    const linkBefore = await screen.getByRole("link")
    const expectedLinkTextBefore =
      component === "A" ? "Link Textaria-new-tab" : "Link Text"
    expect(linkBefore.textContent).toEqual(expectedLinkTextBefore)

    await fireEvent.click(linkBefore)
    const linkAfter = await screen.findByRole("link", {
      name: /Code is Poetry/,
    })
    expect(linkAfter.tagName).toBe("A")
  })
})

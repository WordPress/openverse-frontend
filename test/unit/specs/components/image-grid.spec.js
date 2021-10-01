import ImageGrid from '~/components/ImageGrid/ImageGrid'
import { render, screen } from '@testing-library/vue'

const propsData = {
  images: undefined,
  canLoadMore: undefined,
  isFetching: undefined,
  fetchingError: undefined,
  errorMessageText: undefined,
  isFinished: undefined,
}

test('ImageGrid loads with default values', async () => {
  render(ImageGrid, {
    props: propsData,
  })
  expect(screen.getByRole('button')).toHaveTextContent('browse-page.load')
})

test('ImageGrid renders images without load more button if canLoadMore is false', async () => {
  let propsData = {
    images: [
      { id: 'image1', url: 'http://localhost:8080/image1.png' },
      { id: 'image2', url: 'http://localhost:8080/image2.jpg' },
      { id: 'image3', url: 'http://localhost:8080/image3.svg' },
      { id: 'image4', url: 'http://localhost:8080/image4.jpeg' },
    ],
    canLoadMore: false,
  }
  render(ImageGrid, {
    props: propsData,
    stubs: ['NuxtLink', 'LicenseIcons'],
  })
  expect(screen.queryAllByRole('img').length).toEqual(propsData.images.length)
  expect(screen.queryAllByRole('figure').length).toEqual(
    propsData.images.length
  )
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

test('ImageGrid renders images and load more button if canLoadMore is true', async () => {
  let propsData = {
    images: [
      { id: 'image1', url: 'http://localhost:8080/image1.png' },
      { id: 'image2', url: 'http://localhost:8080/image2.jpg' },
      { id: 'image3', url: 'http://localhost:8080/image3.svg' },
      { id: 'image4', url: 'http://localhost:8080/image4.jpeg' },
    ],
    canLoadMore: true,
  }
  render(ImageGrid, {
    props: propsData,
    stubs: ['NuxtLink', 'LicenseIcons'],
  })
  expect(screen.queryAllByRole('img').length).toEqual(propsData.images.length)
  expect(screen.queryAllByRole('figure').length).toEqual(
    propsData.images.length
  )
  const loadMoreButton = screen.queryByRole('button')
  expect(loadMoreButton).toBeVisible()
  expect(loadMoreButton).toHaveTextContent('browse-page.load')
})

test('ImageGrid shows LoadingIcon instead of LoadMoreButton when isFetching', async () => {
  let propsData = {
    canLoadMore: true,
    images: [
      {
        id: 'image1',
        url: 'http://localhost:8080/image1.png',
        title: 'image1',
      },
    ],
    isFetching: true,
  }
  render(ImageGrid, {
    props: propsData,
    stubs: ['NuxtLink', 'LicenseIcons'],
  })
  // getByRole('button') does not find the button
  expect(screen.getByText('browse-page.load')).not.toBeVisible()
})

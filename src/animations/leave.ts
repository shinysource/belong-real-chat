import { createAnimation } from '@ionic/vue'

const createRootAnimation = (
  baseEl: HTMLElement,
  presentingEl: HTMLElement,
  opts: object,
  elementRef?: HTMLElement,
  duration?: number
) => {
  const rootAnimation = createAnimation()
    .duration(duration || 600)
    .addElement(baseEl)
    .easing('cubic-bezier(0.32, 0.72, 0, 1)')
    .beforeAddClass('transaction-modal-hidden')
    .afterRemoveClass('transaction-modal-hidden')

  const cardDetail = createAnimation()
    .duration(duration || 600)
    .addElement(baseEl.querySelector('#card-detail') as HTMLElement)
    .keyframes([
      { offset: 0, opacity: 1 },
      { offset: 0.7, opacity: 1 },
      { offset: 1, opacity: 1 },
    ])

  const appHome = createAnimation()
    .duration(duration || 600)
    .addElement(baseEl.querySelector('#app-home') as HTMLElement)
    .keyframes([
      { offset: 0, opacity: 0 },
      { offset: 0.7, opacity: 0.08 },
      { offset: 1, opacity: 1 },
    ])
    .beforeRemoveClass('ion-page-hidden')

  return rootAnimation.addAnimation([cardDetail, appHome])
}

export const createTransactionLeaveAnimation = (
  baseEl: HTMLElement,
  opts: object,
  presentingEl: HTMLElement,
  elementRef: HTMLElement,
  translateCardElement?: HTMLElement
) => {
  const cardElement = elementRef as HTMLElement
  const translateParentElement =
    translateCardElement?.parentElement as HTMLElement
  const rootAnimation = createRootAnimation(
    baseEl,
    presentingEl,
    opts,
    cardElement,
    2000
  )

  const transactionsList = createAnimation()
    .addElement(baseEl.querySelectorAll('.transactions-list'))
    .easing('cubic-bezier(0.17, 0.67, 0.22, 1.26)')
    .keyframes([
      { offset: 0, opacity: 1 },
      { offset: 1, opacity: 0 },
    ])

  const parentElement = cardElement?.parentElement?.parentElement as HTMLElement

  const cardBBox = translateParentElement.getBoundingClientRect()

  const mainCard = createAnimation()
    .addElement(parentElement)
    .easing('cubic-bezier(0.17, 0.67, 0.22, 1.26)')
    .keyframes([
      {
        offset: 0,
        transform: `translate(0, calc(-${
          cardBBox.top - 150
        }px + var(--ion-safe-area-top)))`,
      },
      {
        offset: 0.7,
        transform: `translate(0, calc(${
          cardBBox.top - 60
        }px + var(--ion-safe-area-top)))`,
      },
      {
        offset: 1,
        transform: `translate(0, calc(${
          cardBBox.top - 60
        }px + var(--ion-safe-area-top)))`,
      },
    ])

  return rootAnimation.addAnimation([transactionsList, mainCard])
}

export const createGenericLeaveAnimation = (
  baseEl: HTMLElement,
  opts: object,
  presentingEl: HTMLElement,
  elementRef: HTMLElement,
  translateCardElement?: HTMLElement
) => {
  const cardElement = elementRef as HTMLElement
  const rootAnimation = createRootAnimation(
    baseEl,
    presentingEl,
    opts,
    cardElement,
    1800
  ).afterAddWrite(() =>
    document
      .querySelectorAll('.card-mask')
      .forEach((c) => c.classList.add('card-mask'))
  )

  const parentElement = cardElement?.parentElement?.parentElement
    ?.parentElement as HTMLElement

  const translateParentElement = translateCardElement?.parentElement
    ?.parentElement as HTMLElement

  const cardBBox = translateParentElement.getBoundingClientRect()

  const allCards = Array.from(parentElement.querySelectorAll('.card'))
  const primaryCard = allCards[allCards.length - 1]
  const secondaryCards = allCards.slice(0, allCards.length)

  const cardOffset = 50
  const totalCardOffset = cardOffset * secondaryCards.length

  const mainCard = createAnimation()
    .addElement(cardElement)
    .easing('cubic-bezier(0.32, 0.72, 0, 1)')
    .keyframes([
      {
        offset: 0,
        transform: `translate(${cardBBox.x}px, 0)`,
        opacity: 1,
      },
      {
        offset: 0.7,
        transform: `translate(${cardBBox.x}px, calc(${cardBBox.top - 60}px)`,
        opacity: 1,
      },
      {
        offset: 1,
        transform: `translate(${cardBBox.x}px, calc(${cardBBox.top - 60}px)`,
        opacity: 1,
      },
    ])
    .onFinish(() => rootAnimation.play())

  secondaryCards.forEach((card, i) => {
    const cardAnimation = createAnimation()
      .addElement(card)
      .easing('cubic-bezier(0.32, 0.72, 0, 1)')
      .keyframes([
        {
          offset: 0,
          transform: `translate(0, 0)`,
          opacity: 1,
        },
        {
          offset: 0.7,
          transform: `translate(calc(-${93.5 * i}vw + ${cardBBox.x}px), ${
            cardBBox.top - 70 + 10 * (i + 1)
          }px)`,
          opacity: 1,
        },
        {
          offset: 1,
          transform: `translate(calc(-${93.5 * i}vw + ${cardBBox.x}px), ${
            cardBBox.top - 70 + 10 * (i + 1)
          }px)`,
          opacity: 1,
        },
      ])

    rootAnimation.addAnimation(cardAnimation)
  })

  return rootAnimation.addAnimation([mainCard])
}

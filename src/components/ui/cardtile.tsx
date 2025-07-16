import { memo, useCallback } from 'react'
import classNames from 'classnames'
import useAnalytics from '../../hooks/useanalytics'

interface Card {
  id: string
  name: string
  imageUrl: string
  attack: number
  defense: number
  rarity?: string
}

interface CardTileProps {
  card: Card
  onSelect: (card: Card) => void
}

function useCardSelect(card: CardTileProps['card'], onSelect: CardTileProps['onSelect'], trackEvent: (e: string, d?: Record<string, unknown>) => void) {
  return useCallback(() => {
    onSelect(card)
    trackEvent('CardSelected', { cardId: card.id })
  }, [card, onSelect, trackEvent])
}

const CardTile: React.FC<CardTileProps> = ({ card, onSelect }) => {
  const { trackEvent } = useAnalytics()
  const { id, name, imageUrl, attack, defense, rarity } = card
  const handleSelect = useCardSelect(card, onSelect, trackEvent)

  return (
    <button
      type="button"
      className={classNames('card-tile', `card-tile--rarity-${rarity}`)}
      onClick={handleSelect}
      aria-label={`Select card ${name}`}
      data-card-id={id}
    >
      <div className="card-tile__image-wrapper">
        <img
          className="card-tile__image"
          src={imageUrl}
          alt={name}
          loading="lazy"
        />
      </div>
      <div className="card-tile__details">
        <h3 className="card-tile__name">{name}</h3>
        <div className="card-tile__stats">
          <span className="card-tile__stat card-tile__stat--attack">{attack}</span>
          <span className="card-tile__stat card-tile__stat--defense">{defense}</span>
        </div>
      </div>
    </button>
  )
}

export default memo(CardTile)


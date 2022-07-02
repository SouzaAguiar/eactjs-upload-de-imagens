import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const [selectdImageUrl, setSelectdImageUrl] = useState('');
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handlerViewImage = (url: string): void => {
    setSelectdImageUrl(url);
    onOpen();
  };
  return (
    <>
      <SimpleGrid column={3} spacing={10}>
        {cards.map(card => {
          return <Card data={card} viewImage={handlerViewImage} />;
        })}
      </SimpleGrid>

      {isOpen && (
        <ModalViewImage
          imgUrl={selectdImageUrl}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
}

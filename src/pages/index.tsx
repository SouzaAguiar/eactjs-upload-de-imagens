import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery, GetNextPageParamFunction } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  title: string;
  description: string;
  url: string;
  ts: string;
  id: string;
};

interface GetImagesResponse {
  after: string;
  data: Image[];
}

const getImages = async ({ pageParam = null }): Promise<GetImagesResponse> => {
  if (pageParam) {
    const { data } = await api.get('api/images', {
      params: {
        after: pageParam,
      },
    });
    return data;
  }
  const { data } = await api.get('api/images');
  return data;
};
function getNextPageParam(lastpage): GetNextPageParamFunction {
  return lastpage.after ?? null;
}
export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    getImages,
    { getNextPageParam }
    // TODO AXIOS REQUEST WITH PARAM

    // TODO GET AND RETURN NEXT PAGE PARAM
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY

    let images = [];
    data?.pages.map(page => {
      images = [...images, page.data].flat();
    });

    return images;
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />
      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            type="button"
            disabled={isFetchingNextPage}
            onClick={() => {
              fetchNextPage();
            }}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}

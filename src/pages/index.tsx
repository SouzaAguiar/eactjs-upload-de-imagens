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

const getImages = async ({ pageParam = 0 }): Promise<GetImagesResponse> => {
  const resonse = await api.get(`/images?after=${pageParam}`);
  return resonse.data;
};
function getNextPageParam(lastpage): GetNextPageParamFunction {
  return lastpage.after;
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
    {
      getNextPageParam,
    }
    // TODO AXIOS REQUEST WITH PARAM

    // TODO GET AND RETURN NEXT PAGE PARAM
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY

    return data?.pages[0].data.map(page => {
      return {
        title: page.title,
        description: page.description,
        url: page.url,
        ts: page.ts,
        id: page.id,
      };
    });
  }, [data]);

  // TODO RENDER LOADING SCREEN

  // TODO RENDER ERROR SCREEN

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {!isError ? (
            <>
              <Header />
              <Box maxW={1120} px={20} mx="auto" my={20}>
                <CardList cards={formattedData} />
                {hasNextPage && (
                  <Button
                    type="button"
                    onClick={() => {
                      fetchNextPage();
                    }}
                  >
                    {isFetchingNextPage ? 'Carregando' : 'Carregar mais'}
                  </Button>
                )}
              </Box>
            </>
          ) : (
            <Error />
          )}
        </>
      )}
    </>
  );
}

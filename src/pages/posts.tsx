import BasicTable from "@/components/BasicTable";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const getKeys = <T extends Record<string, any>>(data: T[]): (keyof T)[] => {
  if (data.length === 0) {
    return [];
  }
  return Object.keys(data[0]) as (keyof T)[];
};

type Props = {
  posts: Post[];
};

const Posts = ({ posts }: Props) => {
  const keys = getKeys(posts);

  return (
    <div className="m-4">
      <BasicTable keys={keys} data={posts} />
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const posts: Post[] = await response.json();

    return {
      props: {
        posts,
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    return {
      props: {
        posts: [],
      },
    };
  }
};

export default Posts;

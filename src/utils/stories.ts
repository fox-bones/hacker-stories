import type { StoriesState } from '../types/story.js';

const getSumComments = (stories: StoriesState): number => {
  return stories.data.reduce(
    (sum, story) => sum + story.num_comments,
    0
  );
};

export default getSumComments;
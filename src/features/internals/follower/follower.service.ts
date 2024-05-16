import { BadRequestException, Injectable } from '@nestjs/common';
import FollowerRepository from '@/features/internals/follower/follower.repository';
import FollowResponse from '@/features/internals/follower/response/follow.response';
import { ErrorMessages } from '@/common/exceptions/errorMessage.exception';
import UnFollowResponse from '@/features/internals/follower/response/unFollow.response';
import UserRepository from '@/features/internals/user/user.repository';
import ListFollowerResponse from '@/features/internals/follower/response/listFollower.response';
import { Follower } from '@/features/internals/follower/model/follower';
import ListFollowingResponse from '@/features/internals/follower/response/listFollowing.response';

@Injectable()
export class FollowerService {
  constructor(
    private readonly followerRepository: FollowerRepository,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Follow a user.
   * @param followerId
   * @param followedId
   * @throws BadRequestException if the user is already following the target user.
   * @throws BadRequestException if the follower is trying to follow themselves.
   * @returns A FollowResponse object.
   */

  async followUser(
    followerId: number,
    followedId: number,
  ): Promise<FollowResponse> {
    const followedUser = await this.userRepository.byId(followedId);

    if (!followedUser) {
      throw new BadRequestException(ErrorMessages.USER.USER_NOT_FOUND);
    }

    const isAlreadyFollowing = await this.isAlreadyFollowing(
      followerId,
      followedId,
    );

    // User is already followed. Do nothing.
    if (isAlreadyFollowing) {
      return new FollowResponse(true);
    }

    if (followerId === followedId) {
      throw new BadRequestException(
        ErrorMessages.FOLLOWER.CANNOT_FOLLOW_YOURSELF,
      );
    }

    const followerEntity = await this.followerRepository.insert({
      follower_id: followerId,
      followed_id: followedId,
    });
    return new FollowResponse(followerEntity !== null);
  }

  /*
   * Check if the user is already following the target user.
   * @param followerId The ID of the user who is following.
   * @param followedId The ID of the user who is being followed.
   * @returns True if the user is already following the target user, false otherwise.
   */
  private async isAlreadyFollowing(followerId: number, followedId: number) {
    return (
      (await this.followerRepository.byFollowerIdAndFollowedId(
        followerId,
        followedId,
      )) !== null
    );
  }

  /**
   * Unfollow a user.
   *
   * @param followerId
   * @param followedId
   *
   * @throws BadRequestException if the follower is trying to unfollow the user they are not following.
   * @returns An UnFollowResponse object.
   */
  async unfollowUser(
    followerId: number,
    followedId: number,
  ): Promise<UnFollowResponse> {
    const existingFollower =
      await this.followerRepository.byFollowerIdAndFollowedId(
        followerId,
        followedId,
      );

    if (!existingFollower) {
      throw new BadRequestException(ErrorMessages.FOLLOWER.USER_NOT_FOLLOWED);
    }

    const result = await this.followerRepository.delete(existingFollower.id);
    return new UnFollowResponse(result !== null);
  }

  /**
   * Get followers of a user.
   *
   * @param currentUserId
   * @param userId
   * @param page
   * @param perPage
   */
  async getFollowers(
    currentUserId: number,
    userId: number,
    page: number,
    perPage: number,
  ): Promise<ListFollowerResponse> {
    const { data, total } = await this.followerRepository.getFollowers(
      userId,
      page | 1,
      perPage | 10,
    );

    const followingOfCurrentUser =
      await this.followerRepository.byFollowerId(currentUserId);

    const followers: Follower[] = data.map((item) => {
      console.log('item', item);
      const isFollowing = followingOfCurrentUser.some(
        (following) => following.followed_id === item.follower_id,
      );
      return {
        id: item.follower.id,
        full_name: item.follower.full_name,
        email: item.follower.email,
        avatar_url: item.follower.avatar_url,
        is_following: isFollowing,
      };
    });

    return {
      data: followers,
      total,
    };
  }

  async getFollowing(
    currentUserId: number,
    userId: number,
    page: number,
    perPage: number,
  ): Promise<ListFollowingResponse> {
    const { data, total } = await this.followerRepository.getFollowing(
      userId,
      page | 1,
      perPage | 10,
    );

    const followingOfCurrentUser =
      await this.followerRepository.byFollowerId(currentUserId);

    const followings: Follower[] = data.map((item) => {
      const isFollowing = followingOfCurrentUser.some(
        (following) => following.followed_id === item.followed_id,
      );
      return {
        id: item.followed.id,
        full_name: item.followed.full_name,
        email: item.followed.email,
        avatar_url: item.followed.avatar_url,
        is_following: isFollowing,
      };
    });

    return {
      data: followings,
      total,
    };
  }
}

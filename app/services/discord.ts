import { WebhookClient, EmbedBuilder } from "discord.js"
import { IBot } from "../models/mongo-models/bot-v2"
import { IUserMetadata } from "../models/mongo-models/user-metadata"
import { getAvatarSrc } from "../public/src/utils"
import { logger } from "../utils/logger"

let discordWebhook: WebhookClient | undefined
let discordBanWebhook: WebhookClient | undefined

if (process.env.DISCORD_WEBHOOK_URL) {
  discordWebhook = new WebhookClient({
    url: process.env.DISCORD_WEBHOOK_URL
  })
}

if (process.env.DISCORD_BAN_WEBHOOK_URL) {
  discordBanWebhook = new WebhookClient({
    url: process.env.DISCORD_BAN_WEBHOOK_URL
  })
}

export const discordService = {
  announceBan(user: IUserMetadata, bannedUser: IUserMetadata, reason: string) {
    const dsEmbed = new EmbedBuilder()
      .setTitle(`${user.displayName} banned the user ${bannedUser.displayName}`)
      .setAuthor({
        name: user.displayName,
        iconURL: getAvatarSrc(user.avatar)
      })
      .setDescription(
        `${user.displayName} banned the user ${bannedUser.displayName}. Reason: ${reason}`
      )
      .setThumbnail(getAvatarSrc(bannedUser.avatar))
    try {
      discordBanWebhook?.send({
        embeds: [dsEmbed]
      })
    } catch (error) {
      logger.error(error)
    }
  },

  announceUnban(user: IUserMetadata, name: string) {
    const dsEmbed = new EmbedBuilder()
      .setTitle(`${user.displayName} unbanned the user ${name}`)
      .setAuthor({
        name: user.displayName,
        iconURL: getAvatarSrc(user.avatar)
      })
      .setDescription(`${user.displayName} unbanned the user ${name}`)
      .setThumbnail(getAvatarSrc(user.avatar))
    try {
      discordBanWebhook?.send({
        embeds: [dsEmbed]
      })
    } catch (error) {
      logger.error(error)
    }
  },

  announceBotCreation(bot: IBot, url: string, author: string) {
    const dsEmbed = new EmbedBuilder()
      .setTitle(`BOT ${bot.name} created by ${author}`)
      .setURL(url)
      .setAuthor({
        name: author,
        iconURL: getAvatarSrc(bot.avatar)
      })
      .setDescription(
        `A new bot has been created by ${author}, You can import the data in the Pokemon Auto Chess Bot Builder (url: ${url} ).`
      )
      .setThumbnail(getAvatarSrc(bot.avatar))

    try {
      discordWebhook?.send({
        embeds: [dsEmbed]
      })
    } catch (error) {
      logger.error(error)
    }
  },

  announceBotAddition(botData: IBot, url: string, user: IUserMetadata) {
    const dsEmbed = new EmbedBuilder()
      .setTitle(
        `BOT ${botData.name} by @${botData.author} loaded by ${user.displayName}`
      )
      .setURL(url)
      .setAuthor({
        name: user.displayName,
        iconURL: getAvatarSrc(user.avatar)
      })
      .setDescription(
        `BOT ${botData.name} by @${botData.author} (url: ${url} ) loaded by ${user.displayName}`
      )
      .setThumbnail(getAvatarSrc(botData.avatar))
    try {
      discordWebhook?.send({
        embeds: [dsEmbed]
      })
    } catch (error) {
      logger.error(error)
    }
  },

  announceBotDeletion(botData: IBot, user: IUserMetadata) {
    const dsEmbed = new EmbedBuilder()
      .setTitle(
        `BOT ${botData?.name} by @${botData?.author} deleted by ${user.displayName}`
      )
      .setAuthor({
        name: user.displayName,
        iconURL: getAvatarSrc(user.avatar)
      })
      .setDescription(
        `BOT ${botData?.name} by @${botData?.author} (id: ${botData?.id} ) deleted by ${user.displayName}`
      )
      .setThumbnail(getAvatarSrc(botData?.avatar ? botData?.avatar : ""))
    try {
      discordWebhook?.send({
        embeds: [dsEmbed]
      })
    } catch (error) {
      logger.error(error)
    }
  }
}

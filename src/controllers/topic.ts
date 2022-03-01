import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { topic } from '../entities/topic';
import { subscriber } from '../entities/subscriber';
import axios from 'axios';

export const getAll = async (req: Request, res: Response) => {
  const topicRepository = getRepository(topic);
  const topics = await topicRepository.find();
  return res.status(200).json(topics);
};

export const create = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { name } = req.body;

  //TODO: Validate name

  const topicRepository = getRepository(topic);

  const checkForTopicExistence = await topicRepository.findOne({
    where: { name },
  });

  if (checkForTopicExistence) {
    return res.status(400).json({ message: 'Topic already exists' });
  }

  const newTopic = topicRepository.create({ name });

  await topicRepository.save(newTopic);

  return res.status(201).json({
    message: 'Topic created successfully.',
  });
};

export const subscribe = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { url } = req.body;

  //TODO: Validate url

  const topicRepository = getRepository(topic);
  const subscriberRepository = getRepository(subscriber);

  const selectedTopic = await topicRepository.findOne(req.params.topic);

  if (!selectedTopic) {
    return res.status(400).json({ message: 'No topic matches selection' });
  }

  const subscriberAlreadyExists = await subscriberRepository.findOne({
    where: { url, topic: selectedTopic },
  });

  if (subscriberAlreadyExists) {
    return res.status(400).json({ message: 'Subscriber already exists' });
  }

  const newSubscriber = new subscriber();

  newSubscriber.url = url;
  newSubscriber.topic = selectedTopic;

  await subscriberRepository.save(newSubscriber);

  return res.status(200).json({
    url,
    topic: selectedTopic.id,
  });
};

export const publish = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const data = req.body;

  if (typeof data !== 'object') {
    return res.status(400).json({ message: 'Invalid data passed.' });
  }

  const topicRepository = getRepository(topic);

  const selectedTopic = await topicRepository.findOne({
    where: { id: req.params.topic },
    relations: ['subscribers'],
  });

  if (!selectedTopic) {
    return res.status(400).json({ message: 'No topic matches selection' });
  }

  let subscriberUrls = selectedTopic.subscribers.map(
    (subscriber) => subscriber.url,
  );

  if (subscriberUrls.length > 0) {
    await axios.all(subscriberUrls.map((url) => axios.post(url, data)));
  }

  return res.status(200).json({
    data,
    topic: selectedTopic.id,
  });
};

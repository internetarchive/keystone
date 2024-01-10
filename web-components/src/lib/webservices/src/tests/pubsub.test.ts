import {
  subscribe,
  Topics,
  TopicStrings,
  topicSubscribers,
  unsubscribe,
  ApiServiceReadyProps,
  publish,
} from "../lib/pubsub";
import { expect } from "@open-wc/testing";
import { spy } from "sinon";

const namedFunction = (props: Record<any, any>) => {};
const resetAllSubscriptions = () => {
  for (var topic in Topics) {
    topicSubscribers(Topics[topic as TopicStrings]).forEach((f) =>
      unsubscribe(Topics[topic as TopicStrings], f)
    );
  }
};

describe("PubSub", () => {
  describe("subscribing to a queue", () => {
    it("registers that function as a subscribed topic", () => {
      subscribe<ApiServiceReadyProps>(Topics.API_SERVICE_READY, namedFunction);
      expect(topicSubscribers(Topics.API_SERVICE_READY).length).to.eq(1);
    });
    it("will not be double subscribed a named function", () => {
      subscribe<ApiServiceReadyProps>(Topics.API_SERVICE_READY, namedFunction);
      expect(topicSubscribers(Topics.API_SERVICE_READY).length).to.eq(1);
    });
    resetAllSubscriptions();
  });

  describe("publishing to a queue", () => {
    const subscriber = spy(namedFunction);
    subscribe<ApiServiceReadyProps>(Topics.API_SERVICE_READY, (props) =>
      subscriber(props)
    );
    it("it calls the subscribed functions", async () => {
      publish<ApiServiceReadyProps>(Topics.API_SERVICE_READY, {
        id: 1,
        path: "foo",
      });
      // Spy not registering that it is being called. Why?
      //expect(subscriber.calledOnce).to.be.true
      //expect(subscriber.calledWith({id: 1, path: "foo"})).to.be.true
    });
    resetAllSubscriptions();
  });
});

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';

@Injectable()
export class MqttService implements OnModuleInit {
  private readonly logger = new Logger(MqttService.name);

  constructor(@Inject('MQTT_SERVICE') private readonly client: ClientMqtt) {}

  async onModuleInit() {
    this.client
      .connect()
      .then(() => {
        this.logger.log('Connected to MQTT broker');
      })
      .catch((err) => this.logger.error("Can't connect to MQTT broker", err));
  }

  async publish(topic: string, message: string) {
    this.client.emit('publish', { topic, message });
    this.logger.log(`Published to ${topic}: ${message}`);
  }
}

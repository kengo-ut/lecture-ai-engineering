import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

from api.settings import settings


class LLMClient:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_name = settings.LLM_MODEL_NAME
        self.model = AutoModelForCausalLM.from_pretrained(self.model_name).to(
            self.device
        )
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.max_new_tokens = settings.LLM_MAX_NEW_TOKENS

    def generate_response_from_messages(
        self, messages: list[dict[str, str]]
    ) -> str | None:
        input_ids = self.tokenizer.apply_chat_template(
            messages, add_generation_prompt=True, return_tensors="pt"
        )
        output_text = None
        if isinstance(input_ids, torch.Tensor):
            output_ids = self.model.generate(
                input_ids.to(self.device), max_new_tokens=self.max_new_tokens
            )
            output_text = self.tokenizer.batch_decode(
                output_ids[:, input_ids.shape[1] :], skip_special_tokens=True
            )[0]
        return output_text


llm_client = LLMClient()

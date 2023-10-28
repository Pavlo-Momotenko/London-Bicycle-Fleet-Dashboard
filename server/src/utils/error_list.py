class ErrorList:
    def __init__(self):
        self.errors = {}
        self.current_item = 0
        self.max_items = 25

    def add_error(self, error: str) -> None:
        if self.current_item >= self.max_items:
            return None

        self.errors[self.current_item] = error
        self.current_item += 1

    def to_list(self) -> list[str]:
        return list(self.errors.values())

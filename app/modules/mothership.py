import queue

# Main Controller to manage tasks
class Controller():
    def __init__(self):
        # initialize task manager
        self.taskManager = TaskManager()
        self.working = False

    # add task using Task Manager
    def add(self, request_id, data):
        self.taskManager.add(request_id, data)
        self.work()

    def work(self):
        # if currently not working and not done yet
        # check for task to work on and work
        if not self.working:
            if not self.taskManager.queue.empty():
                self.working = True
                # 1. get task
                task = self.taskManager.get()

                # 2. Do task and get result
                # TODO generate result here
                result = 10
                self.working = False

                # 3. update task status
                self.taskManager.update(task["id"], result)

                # 4. re-call untill done with task
                self.work()

    def status(self, request_id):
        if self.taskManager.check_valid_id(request_id):
            status = self.taskManager.task[request_id]
            if status == -1:
                # not finished yet
                return -1
            else:
                # finished
                self.taskManager.delete(request_id)
                return status
        else:
            return -2


# Manage Task Queue
class TaskManager():
    def __init__(self):
        self.pending = 0 # number of tasks
        self.queue = queue.Queue() # task queue
        self.task = {} # task info --> saves result of id

    def add(self, request_id, data):
        self.task[request_id] = -1
        task_obj = {
            "id" : request_id,
            "data" : data
        }
        self.pending += 1
        self.queue.put(task_obj)

    def delete(self, request_id):
        del self.task[request_id]

    def update(self, request_id, value):
        self.pending -= 1
        self.task[request_id] = value

    def get(self): # gets task out of queue
        cur_task = self.queue.get()
        return cur_task

    def check_valid_id(self, request_id):
        return request_id in self.task

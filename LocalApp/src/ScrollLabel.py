from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

# Scroll Label is used for the body of the task
class ScrollLabel(QScrollArea): 
    def __init__(self, *args, **kwargs): 
        QScrollArea.__init__(self, *args, **kwargs) 
        self.setWidgetResizable(True) 
  
        content = QWidget(self) 
        self.setWidget(content) 
  
        self.lay = QVBoxLayout(content) 
        # self.lay.setAlignment(Qt.AlignLeft | Qt.AlignTop) 
        self.lay.setContentsMargins(15, 0, 15, 10)
        self.label = QLabel(content) 

        self.label.setAlignment(Qt.AlignLeft | Qt.AlignTop) 
        self.label.setWordWrap(True) 
        self.lay.addWidget(self.label) 
  
    def setText(self, text): 
        self.label.setText(text) 